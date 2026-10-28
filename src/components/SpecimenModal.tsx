import React, { useState, useEffect } from 'react';
import { Specimen } from '../types';
import { X, Heart, Sparkles, ChevronLeft, ChevronRight, Wind, Layers, Maximize2 } from 'lucide-react';

interface SpecimenModalProps {
  flower: Specimen | null;
  isOpen: boolean;
  theme: 'light' | 'dark';
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onClose: () => void;
  onCommission: (flower: Specimen) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const SpecimenModal: React.FC<SpecimenModalProps> = ({
  flower,
  isOpen,
  theme,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onCommission,
  onNext,
  onPrev
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    setActiveImageIdx(0);
  }, [flower?.id]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !flower) return null;

  const gallery = flower.galleryImages && flower.galleryImages.length > 0
    ? flower.galleryImages
    : [{ url: flower.image, captionVi: 'Góc nhìn toàn cảnh', captionEn: 'Full view' }];

  const currentImage = gallery[activeImageIdx] || gallery[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-xl bg-black/70 animate-fadeIn">
      {/* iOS Bottom Sheet Container on iPhone / Centered Modal on Desktop */}
      <div 
        className={`w-full sm:max-w-4xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] overflow-hidden flex flex-col border shadow-2xl transition-colors duration-300 animate-sheet-up ${
          isDark 
            ? 'bg-[#151614] text-[#ede9df] border-white/15' 
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* iOS Drag Handle Pill (Mobile Top Handle) */}
        <div 
          onClick={onClose}
          className="w-full flex items-center justify-center pt-3 pb-2 cursor-pointer sm:hidden select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-current opacity-30 hover:opacity-60 transition-opacity" />
        </div>

        {/* Modal Top Navigation Bar */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3.5 border-b flex items-center justify-between border-current/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
              SPECIMEN #{flower.indexNumber}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {flower.categoryLabelVi}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onPrev && (
              <button 
                onClick={onPrev}
                className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-mono"
                title="Tác phẩm trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {onNext && (
              <button 
                onClick={onNext}
                className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-mono"
                title="Tác phẩm kế tiếp"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 text-xs"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6 space-y-6">
          {/* Main Photo & Angle Gallery Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden border border-current/10 shadow-lg">
              <img
                src={currentImage.url}
                alt={flower.name}
                className="w-full h-full object-cover object-center filter grayscale-[3%]"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/95">
                {currentImage.captionVi}
              </div>
            </div>

            {/* Gallery Angle Pills if multiple images exist */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border shrink-0 transition-all ${
                      activeImageIdx === idx 
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' 
                        : 'border-current/15 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Titles & Storytelling */}
          <div className="space-y-2 border-b border-current/10 pb-5">
            <h2 className="text-2xl sm:text-3xl font-display font-medium uppercase tracking-tight">
              {flower.vietnameseName || flower.name}
            </h2>
            <p className="font-editorial italic text-sm sm:text-base text-amber-700 dark:text-amber-300">
              {flower.latinName}
            </p>
            <p className="text-xs sm:text-sm font-sans leading-relaxed opacity-90 pt-2 whitespace-pre-line">
              {flower.storyVi || flower.shortDescriptionVi}
            </p>
          </div>

          {/* Materials & Scent Notes Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Materials */}
            {flower.materialsVi && flower.materialsVi.length > 0 && (
              <div className="p-3.5 rounded-xl border border-current/10 bg-black/5 dark:bg-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Kỹ nghệ & Phụ liệu xa xỉ</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {flower.materialsVi.map((mat, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-sans border border-current/10 bg-white/40 dark:bg-black/40">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Scent Profile */}
            {flower.scent && (
              <div className="p-3.5 rounded-xl border border-current/10 bg-black/5 dark:bg-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Tầng hương đặc trưng</span>
                </div>
                <p className="text-xs font-sans leading-relaxed">
                  <span className="font-semibold">{flower.scent.top}</span> · {flower.scent.heart}
                </p>
                <span className="inline-block text-[10px] font-mono text-amber-700 dark:text-amber-300">
                  Cảm xúc: {flower.scent.mood}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Actions with Safe Area Inset for iPhone */}
        <div className="px-4 sm:px-6 py-3 border-t flex items-center gap-2 border-current/10 pb-safe shrink-0 bg-inherit">
          <button
            type="button"
            onClick={() => onToggleWishlist(flower.id)}
            className={`p-3 rounded-full border transition-all active:scale-95 ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : 'border-current/20 hover:border-current/40'
            }`}
            title="Lưu vào Moodboard"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onCommission(flower);
            }}
            className={`flex-1 min-h-[46px] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isDark
                ? 'bg-amber-400 text-black hover:bg-amber-300'
                : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Tư Vấn Thiết Kế Tác Phẩm Này</span>
          </button>
        </div>
      </div>
    </div>
  );
};
