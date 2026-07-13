import { Layers } from 'lucide-react';
import { Language, t, CATEGORY_KEYS } from '../i18n/translations';
import { CategoryIllustration } from './CategoryIllustration';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  language: Language;
}

const categoryAccents: Record<string, { bg: string; border: string }> = {
  '醤油':      { bg: 'bg-[#f5e8d0]', border: 'border-[#c17f3a]' },
  '味噌':      { bg: 'bg-[#f0e6d8]', border: 'border-[#a06830]' },
  '塩':        { bg: 'bg-[#f7f0e6]', border: 'border-[#d4b896]' },
  '砂糖':      { bg: 'bg-[#fdf5ea]', border: 'border-[#e8c98a]' },
  '酢':        { bg: 'bg-[#f0ede0]', border: 'border-[#b8a870]' },
  '油':        { bg: 'bg-[#f5ede0]', border: 'border-[#c8a060]' },
  'スパイス':  { bg: 'bg-[#f8e8e0]', border: 'border-[#c07060]' },
  'ソース':    { bg: 'bg-[#f0e8e8]', border: 'border-[#b08080]' },
  'ドレッシング': { bg: 'bg-[#eef5e8]', border: 'border-[#88b060]' },
  'タレ':      { bg: 'bg-[#f5eae0]', border: 'border-[#c09060]' },
  'だし':      { bg: 'bg-[#ece8f0]', border: 'border-[#9080b0]' },
  '辛味':      { bg: 'bg-[#f8e4e0]', border: 'border-[#d05040]' },
  'ハーブ':    { bg: 'bg-[#e8f0e8]', border: 'border-[#60a060]' },
  '柑橘':      { bg: 'bg-[#f8f0d8]', border: 'border-[#d0a820]' },
  'その他':    { bg: 'bg-[#ede8e0]', border: 'border-[#a09080]' },
};

const categories = [
  '醤油', '味噌', '塩', '砂糖', '酢', '油',
  'スパイス', 'ソース', 'ドレッシング', 'タレ',
  'だし', '辛味', 'ハーブ', '柑橘', 'その他',
];

export function CategoryGrid({ selectedCategory, onSelectCategory, language }: CategoryGridProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-bold text-[#3d1f00] tracking-wide">{t(language, 'browseByCategory')}</span>
        <div className="flex-1 h-px bg-[#e2d5c0]" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {/* すべて */}
        <button
          onClick={() => onSelectCategory('すべて')}
          className={`relative rounded-2xl border-2 p-3 transition-all duration-200 overflow-hidden ${
            selectedCategory === 'すべて'
              ? 'bg-[#7c4a1e] border-[#7c4a1e] shadow-lg scale-[1.03]'
              : 'bg-[#fdf5ea] border-[#e2d5c0] hover:border-[#c17f3a] hover:shadow-md hover:scale-[1.02]'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategory === 'すべて' ? 'bg-white/20' : 'bg-[#f0e6d8]'
            }`}>
              <Layers size={22} className={selectedCategory === 'すべて' ? 'text-white' : 'text-[#7c4a1e]'} />
            </div>
            <span className={`font-bold text-xs leading-tight text-center ${selectedCategory === 'すべて' ? 'text-white' : 'text-[#3d1f00]'}`}>
              {t(language, 'all')}
            </span>
          </div>
        </button>

        {categories.map((category) => {
          const accent = categoryAccents[category] ?? { bg: 'bg-[#ede8e0]', border: 'border-[#a09080]' };
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`relative rounded-2xl border-2 p-3 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'bg-[#7c4a1e] border-[#7c4a1e] shadow-lg scale-[1.03]'
                  : `${accent.bg} ${accent.border} hover:shadow-md hover:scale-[1.02]`
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors overflow-hidden ${
                  isSelected ? 'bg-white/20' : 'bg-white'
                }`}>
                  <CategoryIllustration category={category} className="w-full h-full p-0.5" />
                </div>
                <span className={`font-bold text-xs leading-tight text-center ${isSelected ? 'text-white' : 'text-[#3d1f00]'}`}>
                  {CATEGORY_KEYS[category] ? t(language, CATEGORY_KEYS[category]) : category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
