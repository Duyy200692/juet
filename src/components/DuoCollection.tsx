import React, { useState } from 'react';
import { Specimen, ViewMode } from '../types';
import { 
  Heart, 
  LayoutGrid, 
  Square, 
  ChevronDown, 
  Sparkles, 
  RotateCcw, 
  CalendarDays,
  Check
} from 'lucide-react';

interface DuoCollectionProps {
  flowers: Specimen[];
  theme: 'light' | 'dark';
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectFlower: (flower: Specimen) => void;
}

interface SeasonFilterOption {
  id: string;
  label: string;
  subLabel: string;
  tag: string;
  matcher: (f: Specimen) => boolean;
}

export const DuoCollection: React.FC<DuoCollectionProps> = ({
  flowers,
  theme,
  wishlistIds,
  onToggleWishlist,
  onSelectFlower
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('duo');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const isDark = theme === 'dark';

  // Curated Seasonal Filters with smart matching logic
  const seasonOptions: SeasonFilterOption[] = [
    {
      id: 'all',
      label: 'Tất Cả Các Mùa',
      subLabel: 'All Seasons & Atelier Archives',
      tag: 'Tất Cả',
      matcher: () => true
    },
    {
      id: 'bridal-season',
      label: 'Mùa Cưới & Tình Yêu (Bridal Season)',
      subLabel: 'Mẫu đơn trắng, dạ lan hương, ngọc trai baroque',
      tag: 'Mùa Cưới',
      matcher: (f) => f.category === 'bridal' || f.name.includes('BRIDAL') || f.name.includes('PEONY')
    },
    {
      id: 'autumn-winter',
      label: 'Mùa Thu – Đông & Lễ Hội (Autumn – Winter)',
      subLabel: 'Cúc mẫu đơn hoàng kim, dạ lan xám, vanda lam',
      tag: 'Thu – Đông',
      matcher: (f) => {
        const s = (f.seasonality || '').toLowerCase();
        return s.includes('autumn') || s.includes('winter') || s.includes('tet') || f.name.includes('CHRYSANTHEMUM') || f.name.includes('ODORATA');
      }
    },
    {
      id: 'spring',
      label: 'Mùa Xuân & Khởi Đầu (Spring Awakening)',
      subLabel: 'Diên vĩ hoàng gia xanh đêm, phong quỳ trắng, mao lương',
      tag: 'Mùa Xuân',
      matcher: (f) => {
        const s = (f.seasonality || '').toLowerCase();
        return s.includes('spring') || f.name.includes('IRIS') || f.name.includes('ANEMONE') || f.name.includes('RANUNCULUS');
      }
    },
    {
      id: 'summer-lotus',
      label: 'Mùa Hạ & Sen Cung Đình (Lotus & Architecture)',
      subLabel: 'Sen trắng cung đình, đài sen xanh, dáng cành uốn lượn',
      tag: 'Mùa Hạ',
      matcher: (f) => {
        const s = (f.seasonality || '').toLowerCase();
        return s.includes('june') || s.includes('september') || f.category === 'sculptural' || f.name.includes('LOTUS');
      }
    },
    {
      id: 'year-round',
      label: 'Bộ Sưu Tập Quanh Năm (Year-Round Couture)',
      subLabel: 'Thuyền lan hồ điệp, chậu hoa nghệ thuật, hộp hoa mica',
      tag: 'Quanh Năm',
      matcher: (f) => {
        const s = (f.seasonality || '').toLowerCase();
        return s.includes('quanh năm') || s.includes('year-round') || f.category === 'lan-ho-diep' || f.category === 'chau-hoa' || f.category === 'gio-hop-hoa';
      }
    }
  ];

  const currentOption = seasonOptions.find((opt) => opt.id === selectedSeason) || seasonOptions[0];

  const filtered = flowers.filter(currentOption.matcher);

  const handleSelectSeason = (seasonId: string) => {
    setSelectedSeason(seasonId);
    // Smoothly collapse dropdown after user picks to keep mobile view tidy
    setIsFilterDropdownOpen(false);
  };

  const handleResetFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSeason('all');
    setIsFilterDropdownOpen(false);
  };

  return (
    <section id="collection-archive" className="max-w-6xl mx-auto px-3 sm:px-6 my-6 sm:my-10">
      {/* 1. Main Section Title & View Switcher */}
      <div className="flex items-end justify-between border-b pb-3 mb-4 transition-colors border-current/10">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
            HAUTE COUTURE ARCHIVE · {filtered.length} TÁC PHẨM
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-medium uppercase tracking-tight">
            Bách Khoa Hoa Độc Bản
          </h2>
        </div>

        {/* iPhone Mobile View Mode Switcher (Duo 2 Cột ⇄ Solo 1 Cột) */}
        <div className="flex items-center gap-1 p-1 rounded-full border bg-black/5 dark:bg-white/5 border-current/10 shrink-0">
          <button
            onClick={() => setViewMode('duo')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
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

      {/* 2. Collapsible Seasonal Filter Header (Chỉ xổ xuống khi bấm vào để giữ gọn hệ thống) */}
      <div className="mb-6 relative">
        {/* The Compact Header Button / Trigger */}
        <div
          onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
          className={`w-full p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex items-center justify-between shadow-sm active:scale-[0.99] ${
            isFilterDropdownOpen
              ? 'ring-2 ring-amber-400/50 border-amber-400 bg-amber-400/10'
              : selectedSeason !== 'all'
                ? isDark
                  ? 'bg-white/10 border-amber-400/60 text-white'
                  : 'bg-black/5 border-amber-600/60 text-black'
                : isDark
                  ? 'bg-[#181916] border-white/15 hover:border-white/30 text-[#ede9df]'
                  : 'bg-[#f4f2ed] border-black/15 hover:border-black/30 text-[#141414]'
          }`}
        >
          {/* Left: Seasonal Filter Label & Current Active Season */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-1.5 rounded-xl shrink-0 ${
              selectedSeason !== 'all'
                ? 'bg-amber-400 text-black'
                : isDark ? 'bg-white/10 text-amber-300' : 'bg-black/10 text-amber-700'
            }`}>
              <CalendarDays className="w-4 h-4" />
            </div>

            <div className="min-w-0 text-left">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-semibold leading-tight">
                Lọc Theo Mùa Hoa
              </span>
              <p className="font-display font-medium text-xs sm:text-sm truncate leading-tight">
                {currentOption.label}
                <span className="font-mono text-[10px] opacity-70 ml-1.5 font-normal">
                  ({filtered.length} tác phẩm)
                </span>
              </p>
            </div>
          </div>

          {/* Right: Quick Reset (if filtered) + Smooth Rotating Chevron Icon */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedSeason !== 'all' && (
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-2 py-1 rounded-full text-[10px] font-mono uppercase bg-black/10 dark:bg-white/10 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1"
                title="Quay về tất cả các mùa"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden xs:inline">Tất Cả</span>
              </button>
            )}

            <div className={`p-1 rounded-full transition-transform duration-300 ${
              isFilterDropdownOpen ? 'rotate-180 text-amber-500' : 'opacity-70'
            }`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* The Smooth Dropdown / Accordion Body: Xổ Dữ Liệu Từ Trên Xuống Khi Cần */}
        {isFilterDropdownOpen && (
          <div className={`mt-2 p-3 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300 animate-fadeIn z-30 ${
            isDark 
              ? 'bg-[#1a1b18]/95 border-white/20 text-[#ede9df]' 
              : 'bg-[#f7f5f0]/95 border-black/15 text-[#141414]'
          }`}>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-current/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Chọn Chu Kỳ Mùa Hoặc Bộ Sưu Tập Đặc Quyền:
              </span>
              <span className="text-[10px] font-mono opacity-60">
                Chạm để áp dụng
              </span>
            </div>

            {/* List of Seasonal Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {seasonOptions.map((opt) => {
                const isSelected = selectedSeason === opt.id;
                const count = flowers.filter(opt.matcher).length;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectSeason(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'border-amber-400 bg-amber-400/20 text-white shadow-sm'
                          : 'border-amber-600 bg-amber-500/15 text-black shadow-sm font-semibold'
                        : isDark
                          ? 'border-white/10 hover:border-white/30 bg-black/20 text-white/80'
                          : 'border-black/10 hover:border-black/30 bg-white/60 text-black/80'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs sm:text-sm leading-tight truncate">
                          {opt.label}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-current/15 shrink-0 opacity-75">
                          {count}
                        </span>
                      </div>
                      <p className="text-[10px] font-editorial italic opacity-75 truncate mt-0.5">
                        {opt.subLabel}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dropdown Bottom Quick Close Action */}
            <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(false)}
                className="text-[11px] font-mono opacity-70 hover:opacity-100 hover:underline underline-offset-4"
              >
                Đóng lại (Thu gọn) ↑
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Grid Container: Controlled by viewMode on iPhone, responsive on Desktop */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3 border rounded-3xl border-current/10 bg-black/5 dark:bg-white/5">
          <p className="font-display text-base font-medium">
            Không Có Tác Phẩm Nào Phù Hợp Với Mùa Này
          </p>
          <button
            onClick={() => setSelectedSeason('all')}
            className="px-4 py-2 rounded-full text-xs font-mono font-bold uppercase bg-amber-400 text-black shadow-sm"
          >
            Quay Về Tất Cả Các Mùa
          </button>
        </div>
      ) : (
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
      )}
    </section>
  );
};
