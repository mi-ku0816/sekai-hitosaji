-- =========================================================
-- 氏名（管理者のみ閲覧可・編集不可）と生年月日（編集不可、年齢は自動算出）を追加
-- Supabase の SQL Editor に貼って一度だけ実行してください
-- =========================================================

-- ① profile_private: age(静的な数値、更新されない) を廃止し birthdate(生年月日) に置き換え
ALTER TABLE public.profile_private ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE public.profile_private DROP COLUMN IF EXISTS age;

-- ② 氏名専用テーブル（管理者のみ閲覧可。書き込みポリシーを設けないことで、
--    登録時のトリガー以外からは一切変更できないようにする＝実質編集不可）
CREATE TABLE IF NOT EXISTS public.profile_admin_only (
  id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT
);

ALTER TABLE public.profile_admin_only ENABLE ROW LEVEL SECURITY;

-- 管理者メールは src/app/admin.ts の ADMIN_EMAILS と揃えてください
CREATE POLICY "profile_admin_only_select_admin" ON public.profile_admin_only
  FOR SELECT USING ((auth.jwt() ->> 'email') = 'do.man.26.shibaura@gmail.com');

-- ③ 生年月日を登録後に変更できないようにするトリガー
--    （氏名は profile_admin_only に書き込みポリシー自体が無いため、これだけで変更不可）
CREATE OR REPLACE FUNCTION public.prevent_birthdate_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.birthdate IS NOT NULL AND NEW.birthdate IS DISTINCT FROM OLD.birthdate THEN
    RAISE EXCEPTION '生年月日は登録後に変更できません';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_birthdate_update ON public.profile_private;
CREATE TRIGGER prevent_birthdate_update
  BEFORE UPDATE ON public.profile_private
  FOR EACH ROW EXECUTE FUNCTION public.prevent_birthdate_change();

-- ④ 新規登録トリガーを更新: profile_private.birthdate と profile_admin_only.full_name も作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, taste_badges)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    CASE
      WHEN jsonb_typeof(NEW.raw_user_meta_data->'taste_badges') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'taste_badges'))
      ELSE '{}'::TEXT[]
    END
  );

  INSERT INTO public.profile_private (id, birthdate, gender, prefecture, city)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data->>'birthdate', '')::DATE,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'prefecture',
    NEW.raw_user_meta_data->>'city'
  );

  INSERT INTO public.profile_admin_only (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
