// カテゴリごとの手描き風イラスト（SVG）。醤油・塩などを連想できるアイコンを和モダン配色で表現。
interface Props {
  category: string;
  className?: string;
}

// 和モダン配色
const BROWN = '#7c4a1e';
const DARK = '#3d1f00';
const AMBER = '#c17f3a';
const CREAM = '#fdf5ea';
const RED = '#c0392b';
const GREEN = '#5a7d3c';

export function CategoryIllustration({ category, className }: Props) {
  const common = {
    viewBox: '0 0 64 64',
    className,
    xmlns: 'http://www.w3.org/2000/svg',
  } as const;

  switch (category) {
    case '醤油': // 醤油ボトル
      return (
        <svg {...common}>
          <rect x="26" y="8" width="12" height="6" rx="1.5" fill={DARK} />
          <path d="M24 16 q8-4 16 0 v34 a4 4 0 0 1-4 4 H28 a4 4 0 0 1-4-4 Z" fill={DARK} />
          <rect x="28" y="30" width="16" height="14" rx="1.5" fill={CREAM} />
          <text x="32" y="40" fontSize="8" fill={BROWN} textAnchor="middle" fontWeight="bold">醤</text>
        </svg>
      );
    case '味噌': // 味噌の樽
      return (
        <svg {...common}>
          <path d="M16 24 h32 l-3 26 a4 4 0 0 1-4 4 H23 a4 4 0 0 1-4-4 Z" fill={AMBER} />
          <ellipse cx="32" cy="24" rx="16" ry="5" fill={BROWN} />
          <ellipse cx="32" cy="23" rx="12" ry="3.5" fill="#a9743f" />
          <rect x="16" y="34" width="32" height="3" fill={DARK} opacity="0.3" />
        </svg>
      );
    case '塩': // 塩の瓶（振りかけ）
      return (
        <svg {...common}>
          <rect x="24" y="14" width="16" height="8" rx="2" fill={BROWN} />
          <circle cx="29" cy="18" r="1" fill={CREAM} />
          <circle cx="35" cy="18" r="1" fill={CREAM} />
          <circle cx="32" cy="16" r="1" fill={CREAM} />
          <path d="M23 22 h18 v26 a4 4 0 0 1-4 4 H27 a4 4 0 0 1-4-4 Z" fill={CREAM} stroke={AMBER} strokeWidth="1.5" />
          <circle cx="29" cy="36" r="1.6" fill={AMBER} />
          <circle cx="35" cy="40" r="1.6" fill={AMBER} />
          <circle cx="31" cy="44" r="1.6" fill={AMBER} />
        </svg>
      );
    case '砂糖': // 角砂糖とスプーン
      return (
        <svg {...common}>
          <rect x="14" y="30" width="18" height="18" rx="2" fill={CREAM} stroke={AMBER} strokeWidth="1.5" />
          <line x1="14" y1="39" x2="32" y2="39" stroke={AMBER} strokeWidth="1" />
          <line x1="23" y1="30" x2="23" y2="48" stroke={AMBER} strokeWidth="1" />
          <ellipse cx="44" cy="26" rx="6" ry="4" fill={BROWN} />
          <rect x="43" y="28" width="2" height="20" rx="1" fill={BROWN} />
        </svg>
      );
    case '酢': // 酢のボトル
      return (
        <svg {...common}>
          <rect x="28" y="8" width="8" height="8" fill={BROWN} />
          <path d="M26 16 h12 v10 l4 6 v18 a4 4 0 0 1-4 4 H26 a4 4 0 0 1-4-4 V32 l4-6 Z" fill="#e8d9b8" stroke={AMBER} strokeWidth="1.5" />
          <path d="M22 40 h20 v12 a4 4 0 0 1-4 4 H26 a4 4 0 0 1-4-4 Z" fill={AMBER} opacity="0.55" />
        </svg>
      );
    case '油': // オイルボトルと雫
      return (
        <svg {...common}>
          <rect x="29" y="8" width="6" height="7" fill={GREEN} />
          <path d="M26 15 h12 v33 a5 5 0 0 1-5 5 H31 a5 5 0 0 1-5-5 Z" fill="#c9b458" stroke={BROWN} strokeWidth="1.5" />
          <path d="M32 26 q5 7 5 11 a5 5 0 0 1-10 0 q0-4 5-11 Z" fill={GREEN} opacity="0.6" />
        </svg>
      );
    case 'スパイス': // スパイス瓶
      return (
        <svg {...common}>
          <rect x="24" y="12" width="16" height="6" rx="1.5" fill={DARK} />
          <rect x="23" y="18" width="18" height="34" rx="3" fill={CREAM} stroke={RED} strokeWidth="1.5" />
          <rect x="23" y="30" width="18" height="22" rx="1" fill={RED} opacity="0.25" />
          <circle cx="30" cy="15" r="1" fill={CREAM} />
          <circle cx="34" cy="15" r="1" fill={CREAM} />
        </svg>
      );
    case 'ソース': // ソースボトル
      return (
        <svg {...common}>
          <rect x="29" y="8" width="6" height="8" rx="1" fill={DARK} />
          <path d="M26 16 h12 v6 l3 6 v20 a4 4 0 0 1-4 4 H27 a4 4 0 0 1-4-4 V28 l3-6 Z" fill="#8b2f1a" stroke={DARK} strokeWidth="1.5" />
          <rect x="26" y="34" width="12" height="12" rx="1.5" fill={CREAM} />
        </svg>
      );
    case 'ドレッシング': // 2層ドレッシング
      return (
        <svg {...common}>
          <rect x="29" y="8" width="6" height="7" fill={AMBER} />
          <path d="M26 15 h12 v33 a5 5 0 0 1-5 5 H31 a5 5 0 0 1-5-5 Z" fill="#f0e6c8" stroke={AMBER} strokeWidth="1.5" />
          <path d="M26 38 h12 v10 a5 5 0 0 1-5 5 H31 a5 5 0 0 1-5-5 Z" fill={GREEN} opacity="0.5" />
          <path d="M26 30 h12 v9 H26 Z" fill={AMBER} opacity="0.4" />
        </svg>
      );
    case 'タレ': // 小皿にタレ
      return (
        <svg {...common}>
          <ellipse cx="32" cy="40" rx="20" ry="9" fill={CREAM} stroke={AMBER} strokeWidth="1.5" />
          <ellipse cx="32" cy="39" rx="13" ry="5.5" fill={DARK} opacity="0.75" />
          <path d="M20 24 q4 6 0 10" stroke={BROWN} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'だし': // お椀と湯気
      return (
        <svg {...common}>
          <path d="M14 34 h36 l-3 12 a5 5 0 0 1-5 4 H22 a5 5 0 0 1-5-4 Z" fill={DARK} />
          <ellipse cx="32" cy="34" rx="18" ry="4" fill={AMBER} />
          <path d="M27 20 q3 4 0 8 M32 18 q3 4 0 8 M37 20 q3 4 0 8" stroke={BROWN} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case '辛味': // 赤唐辛子
      return (
        <svg {...common}>
          <path d="M20 20 q6-4 10 2 q10 6 12 24 q-1 6-6 4 q-4-14-12-22 q-4-4-4-8 Z" fill={RED} />
          <path d="M20 20 q-2-6 4-8 q4 2 6 8 q-6-2-10 0 Z" fill={GREEN} />
        </svg>
      );
    case 'ハーブ': // ハーブの葉
      return (
        <svg {...common}>
          <path d="M32 52 V22" stroke={BROWN} strokeWidth="2" strokeLinecap="round" />
          <path d="M32 30 q-12-2-14-12 q12-1 14 8 Z" fill={GREEN} />
          <path d="M32 40 q12-2 14-12 q-12-1-14 8 Z" fill={GREEN} opacity="0.85" />
          <path d="M32 26 q-10 0-12-8 q10 0 12 6 Z" fill={GREEN} opacity="0.7" />
        </svg>
      );
    case '柑橘': // 柑橘の輪切り
      return (
        <svg {...common}>
          <circle cx="32" cy="34" r="20" fill={AMBER} />
          <circle cx="32" cy="34" r="16" fill="#f4c542" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <path
                key={i}
                d={`M32 34 L${32 + 14 * Math.cos(a - 0.32)} ${34 + 14 * Math.sin(a - 0.32)} A14 14 0 0 1 ${32 + 14 * Math.cos(a + 0.32)} ${34 + 14 * Math.sin(a + 0.32)} Z`}
                fill="#fdeeb8"
                stroke={AMBER}
                strokeWidth="0.8"
              />
            );
          })}
          <circle cx="32" cy="34" r="2.5" fill={CREAM} />
        </svg>
      );
    default: // その他
      return (
        <svg {...common}>
          <rect x="22" y="18" width="20" height="34" rx="4" fill={CREAM} stroke={AMBER} strokeWidth="1.5" />
          <rect x="25" y="12" width="14" height="7" rx="2" fill={BROWN} />
          <path d="M32 28 l2 4 4 .5-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.5 Z" fill={AMBER} />
        </svg>
      );
  }
}
