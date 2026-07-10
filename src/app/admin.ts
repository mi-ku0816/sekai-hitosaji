import { User } from './types';

// 管理者のメールアドレス一覧。ここに追加したメールでログインした人だけが管理者ツールを使えます。
export const ADMIN_EMAILS = [
  'bq22061@shibaura-it.ac.jp',
  // チームメンバーのメールをここに追加してください
];

export function isAdmin(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase());
}
