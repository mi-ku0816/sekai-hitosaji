import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません。.envファイルを確認してください。');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // メール確認リンクを開いた際、URLに含まれるトークンを自動検出してログイン状態にする
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    // implicit フロー: 確認リンクを別の端末・ブラウザで開いてもログインできる
    flowType: 'implicit',
  },
});
