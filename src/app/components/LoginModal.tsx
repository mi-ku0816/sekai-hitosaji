import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn, signUp } from '../../lib/auth';
import { PREFECTURES } from '../types';

const TASTE_BADGES = [
  '辛党','甘党','塩味好き','酸味好き','苦味好き','旨味好き',
  'グルメ','健康志向','伝統派','冒険派','万能型',
  'スパイスマニア','発酵食品好き','無添加派',
  '減塩派','糖質控えめ','和食派','洋食派','中華好き','エスニック好き',
];

const TERMS_SECTIONS: { title: string; body?: string; list?: string[]; contact?: boolean }[] = [
  { title: '第1条（目的）', body: '本サービス「世界のひとさじ」（以下「本サービス」）は、世界各国の調味料に関する情報をユーザーが投稿・共有し、閲覧・検索できるプラットフォームです。ユーザーは本規約に同意の上、本サービスを利用するものとします。' },
  { title: '第2条（投稿コンテンツ）', body: 'ユーザーは、文章、画像、動画、レビューその他の情報（以下「投稿コンテンツ」）を投稿できます。投稿者は、投稿コンテンツについて必要な権利を有し、または適法な利用許諾を得ていることを保証するものとします。' },
  { title: '第3条（禁止事項）', list: ['他者の著作権、商標権、肖像権、プライバシー権その他の権利を侵害する行為', 'メーカー公式サイト、ECサイト、カタログ、雑誌等から無断転載した画像の投稿', '虚偽または誤解を招く情報の投稿', '誹謗中傷、差別的表現、嫌がらせ行為', '法令または公序良俗に反する行為', 'スパム投稿、広告投稿、営利目的の不正利用', 'システムへの不正アクセス', 'その他、運営者が不適切と判断する行為'] },
  { title: '第4条（投稿コンテンツの利用許諾）', body: 'ユーザーは、投稿コンテンツについて著作権を保持します。ただしユーザーは運営者に対し、本サービスの運営・改善・広報・研究開発・マーケティング分析を目的として、投稿コンテンツを無償かつ非独占的に利用、複製、編集、公開、翻訳できる権利を許諾するものとします。' },
  { title: '第5条（AI生成コンテンツ）', body: 'AI技術により生成された画像または文章を投稿する場合、ユーザーは可能な限りその旨を明示するものとします。AI生成コンテンツについても第三者の権利を侵害しないことを保証するものとします。' },
  { title: '第6条（コンテンツの削除）', body: '運営者は規約違反、権利侵害申告、法令上の要請があった場合、事前通知なく投稿コンテンツを削除または非公開にすることができます。' },
  { title: '第7条（個人情報の取り扱い）', body: 'ユーザー登録時に取得する年齢・性別・居住地は、統計分析・サービス改善の目的にのみ利用し、第三者に開示しません。ニックネームおよび味覚バッジは、投稿とともに他のユーザーに公開されます。' },
  { title: '第8条（著作権ポリシー）', body: '投稿者は自身が権利を有するコンテンツのみを投稿してください。他サイトからの無断転載、雑誌・書籍のスキャン画像、他者が撮影した画像の無断使用は禁止します。権利侵害を発見した場合は下記窓口へご連絡ください。', contact: true },
  { title: '第9条（免責事項）', body: '掲載情報はユーザー投稿を含みます。原材料、栄養成分、アレルギー情報等については必ずメーカー公式情報をご確認ください。本サービスの情報に基づいて生じた損害について、運営者は責任を負いません。' },
  { title: '第10条（準拠法・管轄）', body: '本規約は日本法に準拠します。本サービスに関して紛争が生じた場合、運営者所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。' },
];

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ログイン用
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 登録用
  const [nickname, setNickname] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('回答しない');
  const [prefecture, setPrefecture] = useState('');
  const [city, setCity] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'メールアドレスまたはパスワードが正しくありません'
        : (err?.message || err?.error_description || 'ログインに失敗しました'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nickname.trim()) { setError('ニックネームを入力してください'); return; }
    if (!fullName.trim()) { setError('氏名を入力してください'); return; }
    if (!birthdate) { setError('生年月日を入力してください'); return; }
    if (password.length < 6) { setError('パスワードは6文字以上で入力してください'); return; }
    if (!agreedToTerms) { setError('利用規約に同意してください'); return; }
    setLoading(true);
    try {
      await signUp({
        email, password, nickname,
        fullName: fullName.trim(),
        birthdate,
        gender, prefecture, city,
        taste_badges: selectedBadges,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message === 'User already registered'
        ? 'このメールアドレスは既に登録されています'
        : (err?.message || err?.error_description || '登録に失敗しました'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {mode === 'login' ? 'ログイン' : 'ユーザー登録'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${mode === 'login' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            ログイン
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${mode === 'signup' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1">ニックネーム <span className="text-orange-500">*</span></label>
                <input
                  type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                  placeholder="例: 調味料マスター"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">氏名 <span className="text-orange-500">*</span></label>
                <input
                  type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="例: 山田 太郎"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">管理者のみが確認できます。登録後の変更はできません。</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">メールアドレス <span className="text-orange-500">*</span></label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">パスワード <span className="text-orange-500">*</span></label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? '6文字以上' : 'パスワード'}
                className="w-full border rounded-lg pl-9 pr-10 py-2 text-sm focus:outline-none focus:border-orange-400"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">生年月日 <span className="text-orange-500">*</span></label>
                  <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">年齢は自動計算されます。登録後の変更はできません。</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">性別</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    <option>回答しない</option>
                    <option>男性</option>
                    <option>女性</option>
                    <option>その他</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">都道府県</label>
                  <select value={prefecture} onChange={e => setPrefecture(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    <option value="">選択</option>
                    {PREFECTURES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">市区町村</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)}
                    placeholder="例: 渋谷区"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">味覚バッジ（複数選択可）</label>
                <div className="grid grid-cols-3 gap-2">
                  {TASTE_BADGES.map(badge => (
                    <button
                      key={badge} type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`py-2 px-2 rounded-full text-xs border transition-all ${
                        selectedBadges.includes(badge)
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-orange-300'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">利用規約</label>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-3 bg-gray-50 text-xs text-gray-700 leading-relaxed">
                  {TERMS_SECTIONS.map(({ title, body, list, contact }) => (
                    <div key={title}>
                      <p className="font-bold text-gray-800 mb-1">{title}</p>
                      {body && <p>{body}</p>}
                      {list && (
                        <ol className="list-decimal list-inside space-y-0.5">
                          {list.map((item, i) => <li key={i}>{item}</li>)}
                        </ol>
                      )}
                      {contact && (
                        <p className="mt-1 text-gray-500">【権利侵害申告窓口】copyright@world-condiment.example.com</p>
                      )}
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    上記の利用規約に同意します <span className="text-orange-500">*</span>
                  </span>
                </label>
              </div>
            </>
          )}

          <button
            type="submit" disabled={loading || (mode === 'signup' && !agreedToTerms)}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'ログイン' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  );
}
