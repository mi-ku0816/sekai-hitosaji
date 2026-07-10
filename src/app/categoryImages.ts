// カテゴリごとの代表イメージ画像。掲載商品の写真から各カテゴリを代表するものを割り当てています。
// 画像がまだ無いカテゴリは絵文字でフォールバックします（categoryEmoji 参照）。

export const CATEGORY_IMAGES: Record<string, string> = {
  '醤油': '/condiments/05_a.jpg',   // 生きてる醤油
  '味噌': '',                        // 画像未登録 → 絵文字
  '塩': '/condiments/11_a.jpg',     // 笹川流れの塩
  '砂糖': '',
  '酢': '/condiments/09_a.jpg',     // 赤ぽん酢
  '油': '',
  'スパイス': '/condiments/03_a.jpg', // 離宮の食べる七味
  'ソース': '/condiments/13_a.jpg',   // マスターネ
  'ドレッシング': '',
  'タレ': '/condiments/14_a.jpg',    // いしる
  'だし': '/condiments/06_a.jpg',    // だし醤油
  '辛味': '/condiments/01_a.jpg',    // みどりのラー油
  'ハーブ': '',
  '柑橘': '',
  'その他': '',
};

export const CATEGORY_EMOJI: Record<string, string> = {
  '醤油': '🫙', '味噌': '🪣', '塩': '🧂', '砂糖': '🍬',
  '酢': '🧪', '油': '🫒', 'スパイス': '🌶️', 'ソース': '🥫',
  'ドレッシング': '🥗', 'タレ': '🍢', 'だし': '🍵',
  '辛味': '🔥', 'ハーブ': '🌿', '柑橘': '🍋', 'その他': '✨',
};
