-- =========================================================
-- 新規登録時にプロフィール（年齢・性別・居住地・味覚バッジ）が
-- 反映されない不具合の修正
-- Supabase の SQL Editor に貼って一度だけ実行してください
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, age, gender, prefecture, city, taste_badges)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    (NEW.raw_user_meta_data->>'age')::INTEGER,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'prefecture',
    NEW.raw_user_meta_data->>'city',
    CASE
      WHEN jsonb_typeof(NEW.raw_user_meta_data->'taste_badges') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'taste_badges'))
      ELSE '{}'::TEXT[]
    END
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
