-- =========================================================
-- プロフィールの非公開情報（年齢・性別・居住地）を分離
-- 現状 profiles テーブルは誰でも（未ログインでも）全カラムを
-- 読み取れる設定になっており、年齢・性別・居住地が漏洩する状態だった。
-- これらを別テーブルに分け、本人と管理者のみ閲覧可能にする。
-- Supabase の SQL Editor に貼って一度だけ実行してください
-- =========================================================

-- ① 非公開情報テーブルを作成
CREATE TABLE IF NOT EXISTS public.profile_private (
  id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  age        INTEGER,
  gender     TEXT CHECK (gender IN ('男性','女性','その他','回答しない')),
  prefecture TEXT,
  city       TEXT
);

-- ② 既存データを移行
INSERT INTO public.profile_private (id, age, gender, prefecture, city)
SELECT id, age, gender, prefecture, city FROM public.profiles
ON CONFLICT (id) DO NOTHING;

-- ③ profiles テーブルから非公開カラムを削除
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gender;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS prefecture;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS city;

-- ④ RLS: 本人または管理者のみ閲覧・作成・更新可能
--    管理者メールは src/app/admin.ts の ADMIN_EMAILS と揃えてください
ALTER TABLE public.profile_private ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile_private_select_self_or_admin" ON public.profile_private
  FOR SELECT USING (
    auth.uid() = id
    OR (auth.jwt() ->> 'email') = 'do.man.26.shibaura@gmail.com'
  );

CREATE POLICY "profile_private_insert_self" ON public.profile_private
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profile_private_update_self" ON public.profile_private
  FOR UPDATE USING (auth.uid() = id);

-- ⑤ トリガーを更新: auth.users 登録時に両テーブルへ作成
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

  INSERT INTO public.profile_private (id, age, gender, prefecture, city)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'age')::INTEGER,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'prefecture',
    NEW.raw_user_meta_data->>'city'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
