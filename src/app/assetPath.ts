// public 配下の画像パスに、配信先の base パス（GitHub Pages では /sekai-hitosaji/）を付与する。
// 開発時は base が '/' なのでそのまま。http(s):// や data: の外部URLは変更しない。
export function withBase(url?: string): string | undefined {
  if (!url) return url;
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${url.replace(/^\//, '')}`;
}
