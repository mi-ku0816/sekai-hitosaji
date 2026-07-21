-- =========================================================
-- リポジトリ移管（mi-ku0816 → do-man-kenkyu 組織）に伴う
-- condiments.image_url の一括置換
-- Supabase の SQL Editor で一度だけ実行してください
-- =========================================================
UPDATE public.condiments
SET image_url = REPLACE(
  image_url,
  'mi-ku0816.github.io/sekai-hitosaji/',
  'do-man-kenkyu.github.io/sekai-hitosaji/'
)
WHERE image_url LIKE '%mi-ku0816.github.io/sekai-hitosaji/%';
