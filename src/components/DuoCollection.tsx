import React, { useState } from 'react';
import { Specimen, ViewMode } from '../types';
import { Heart, LayoutGrid, Square, Sparkles, Filter } from 'lucide-react';

interface DuoCollectionProps {
  flowers: Specimen[];
  theme: 'light' | 'dark';
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectFlower: (flower: Specimen) => void;
}

export const DuoCollection: React.FC<DuoCollectionProps> = ({
  flowers,
  theme,
  wishlistIds,
  onToggleWishlist,
  onSelectFlower
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('duo');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isDark = theme === 'dark';

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'bridal', label: 'Hoa Cưới' },
    { id: 'installation', label: 'Điêu Khắc' },
    { id: 'seasonal', label: 'Mùa Này' },
    { id: 'vase', label: 'Bình Hoa' }
  ];

  const filtered = selectedCategory === 'all'
    ? flowers
    : flowers.filter((f) => f.category === selectedCategory);

  return (
    <section id="collection-archive" className="max-w-6xl mx-auto px-3 sm:px-6 my-6 sm:my-12">
      {/* Section Header with Category Chips & iPhone View Switcher */}
      <div className="flex flex-col gap-4 mb-5 sm:mb-8">
        <div className="flex items-end justify-between border-b pb-3 transition-colors border-current/10">
          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
              HAUTE COUTURE ARCHIVE · {filtered.length} TÁC PHẨM
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-medium uppercase tracking-tight">
              Bách Khoa Hoa Độc Bản
            </h2>
          </div>

          {/* iPhone Mobile View Mode Switcher (Duo 2 Cột ⇄ Solo 1 Cột) */}
          <div className="flex items-center gap-1 p-1 rounded-full border bg-black/5 dark:bg-white/5 border-current/10">
            <button
              onClick={() => setViewMode('duo')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all ${
                viewMode === 'duo'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Chế độ 2 Cột (Duo Lookbook)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Duo</span>
            </button>

            <button
              onClick={() => setViewMode('solo')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all ${
                viewMode === 'solo'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Chế độ 1 Cột (Solo Khổ Lớn)"
            >
              <Square className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Solo</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Horizontal scrollable on iPhone) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-mono uppercase">
          <Filter className="w-3.5 h-3.5 shrink-0 opacity-50 ml-1 mr-0.5" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? isDark
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-[#141414] text-[#dcd8cf] font-bold border-[#141414]'
                  : isDark
                    ? 'border-white/10 hover:border-white/30 text-white/70'
                    : 'border-black/10 hover:border-black/30 text-black/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container: Controlled by viewMode on iPhone, responsive on Desktop */}
      <div
        className={
          viewMode === 'duo'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
        }
      >
        {filtered.map((flower) => {
          const isWishlisted = wishlistIds.includes(flower.id);

          return (
            <div
              key={flower.id}
              onClick={() => onSelectFlower(flower)}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer select-none active:scale-[0.98] ${
                viewMode === 'duo' ? 'aspect-[3/4]' : 'aspect-[4/5] sm:aspect-[3/4]'
              } ${
                isDark
                  ? 'bg-[#191a18] border-white/10 hover:border-amber-400/60 shadow-lg'
                  : 'bg-[#f4f2ed] border-black/10 hover:border-black/40 shadow-md'
              }`}
            >
              {/* Product Photography */}
              <img
                src={flower.image}
                alt={flower.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 filter grayscale-[3%] group-hover:grayscale-0"
                loading="lazy"
              />

              {/* Top Bar on Card: Index & Wishlist Button */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-white/95 tracking-widest font-semibold border border-white/10">
                  #{flower.indexNumber}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(flower.id);
                  }}
                  className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md border transition-transform active:scale-90 ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-400 shadow-md scale-105'
                      : 'bg-black/40 text-white/90 hover:bg-black/70 border-white/20'
                  }`}
                  aria-label="Thêm vào Moodboard"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Bottom Floating Glass Card with Title & Details (Haute Couture Mobile Presentation) */}
              <div className="absolute inset-x-2 bottom-2 z-20 rounded-xl p-2.5 sm:p-3 backdrop-blur-xl border transition-all duration-300 bg-black/65 border-white/15 text-white flex flex-col justify-end">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-amber-300 truncate">
                    {flower.categoryLabelVi}
                  </span>
                  {flower.materialsVi && flower.materialsVi.length > 0 && (
                    <span className="hidden sm:inline-block text-[8px] font-mono text-white/70 truncate">
                      {flower.materialsVi[0]}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xs sm:text-sm font-medium tracking-wide leading-tight line-clamp-1 text-white drop-shadow">
                  {flower.vietnameseName || flower.name}
                </h3>

                <p className="font-editorial italic text-[9px] sm:text-[11px] text-white/80 truncate mt-0.5">
                  {flower.latinName}
                </p>

                {/* In Solo Mode on iPhone, show short description */}
                {viewMode === 'solo' && (
                  <p className="text-[10px] font-sans text-white/90 line-clamp-2 mt-2 leading-relaxed border-t border-white/10 pt-1.5">
                    {flower.shortDescriptionVi}
                  </p>
                )}
              </div>

              {/* Gradient Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
