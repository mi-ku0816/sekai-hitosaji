import { supabase } from './supabase';
import type { User } from '../app/types';

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  age?: number;
  gender?: string;
  prefecture?: string;
  city?: string;
  taste_badges?: string[];
}

export async function signUp(data: SignUpData) {
  // GitHub Pages はサブパス（/sekai-hitosaji/）配信のため、確認メールのリンク先を
  // 現在のオリジン＋baseパスに明示しないと Supabase の Site URL（既定値）に飛ばされ 404 になる
  const emailRedirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;

  // メール確認が有効な場合、確認完了までは未ログイン状態でRLSにより profiles への
  // 直接書き込みができない。そのためプロフィール項目もユーザーメタデータとして渡し、
  // auth.users 作成時のトリガー（handle_new_user）側で profiles に反映する。
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        nickname: data.nickname,
        age: data.age,
        gender: data.gender,
        prefecture: data.prefecture,
        city: data.city,
        taste_badges: data.taste_badges ?? [],
      },
      emailRedirectTo,
    },
  });
  if (error) throw error;
  if (!authData.user) throw new Error('ユーザー作成に失敗しました');

  return authData.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;

  return {
    id: data.id,
    nickname: data.nickname,
    email: '',
    age: data.age ?? 0,
    prefecture: data.prefecture ?? '',
    city: data.city ?? '',
    gender: (data.gender as User['gender']) ?? '回答しない',
    tasteBadges: (data.taste_badges ?? []) as User['tasteBadges'],
  };
}

export async function updateProfile(userId: string, updates: Partial<SignUpData>) {
  const { error } = await supabase.from('profiles').update({
    nickname: updates.nickname,
    age: updates.age,
    gender: updates.gender,
    prefecture: updates.prefecture,
    city: updates.city,
    taste_badges: updates.taste_badges,
  }).eq('id', userId);
  if (error) throw error;
}
