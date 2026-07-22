-- =========================================================
-- プロフィール構造を最新版へ一括移行する統合スクリプト
-- （profile_private / profile_admin_only の作成、氏名・生年月日対応まで）
--
-- 現在のDB（profiles に age/gender/prefecture/city が直接ある状態）から
-- 目的の状態へ一度で移行します。Supabase の SQL Editor に貼って
-- 一度だけ実行してください。何度実行しても安全です（冪等）。
-- =========================================================

-- ① 非公開情報テーブル（生年月日・性別・居住地）。本人と管理者のみ閲覧可能
CREATE TABLE IF NOT EXISTS public.profile_private (
  id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  birthdate  DATE,
  gender     TEXT CHECK (gender IN ('男性','女性','その他','回答しない')),
  prefecture TEXT,
  city       TEXT
);

-- ② 氏名テーブル（管理者のみ閲覧可・編集不可）
CREATE TABLE IF NOT EXISTS public.profile_admin_only (
  id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT
);

-- ③ 既存データを移行（gender/prefecture/city のみ。age は生年月日に変換できないため引き継がない）
--    profiles に旧カラムが残っている場合のみ実行される
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    INSERT INTO public.profile_private (id, gender, prefecture, city)
    SELECT id, gender, prefecture, city FROM public.profiles
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- ④ profiles から非公開カラムを削除（公開情報のみ残す）
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gender;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS prefecture;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS city;

-- ⑤ RLS 有効化
ALTER TABLE public.profile_private    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_admin_only ENABLE ROW LEVEL SECURITY;

-- ⑥ RLS ポリシー（既存があれば作り直す）
--    管理者メールは src/app/admin.ts の ADMIN_EMAILS と揃えてください
DROP POLICY IF EXISTS "profile_private_select_self_or_admin" ON public.profile_private;
CREATE POLICY "profile_private_select_self_or_admin" ON public.profile_private
  FOR SELECT USING (
    auth.uid() = id OR (auth.jwt() ->> 'email') = 'do.man.26.shibaura@gmail.com'
  );

DROP POLICY IF EXISTS "profile_private_insert_self" ON public.profile_private;
CREATE POLICY "profile_private_insert_self" ON public.profile_private
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profile_private_update_self" ON public.profile_private;
CREATE POLICY "profile_private_update_self" ON public.profile_private
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profile_admin_only_select_admin" ON public.profile_admin_only;
CREATE POLICY "profile_admin_only_select_admin" ON public.profile_admin_only
  FOR SELECT USING ((auth.jwt() ->> 'email') = 'do.man.26.shibaura@gmail.com');

-- ⑦ 既存ユーザー分の profile_private / profile_admin_only 行を補完
--    （メール確認前でも getProfile が成功するように、全 profiles に対応行を用意）
INSERT INTO public.profile_private (id)
SELECT id FROM public.profiles ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profile_admin_only (id)
SELECT id FROM public.profiles ON CONFLICT (id) DO NOTHING;

-- ⑧ 新規登録トリガー: profiles / profile_private / profile_admin_only を作成
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
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profile_private (id, birthdate, gender, prefecture, city)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data->>'birthdate', '')::DATE,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'prefecture',
    NEW.raw_user_meta_data->>'city'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profile_admin_only (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ⑨ 生年月日を登録後に変更できないようにするトリガー
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
