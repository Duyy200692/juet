import React, { useState, useEffect, useRef } from 'react';
import { initialAtelier } from '../data/atelier';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

interface HeroSliderProps {
  theme: 'light' | 'dark';
  onExploreCollection: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ theme, onExploreCollection }) => {
  const slides = initialAtelier.heroSlides;
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const autoPlayRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  // Auto-play timer
  useEffect(() => {
    if (isSwiping) return;
    autoPlayRef.current = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides.length, isSwiping]);

  // Touch Handlers for iPhone gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsSwiping(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.touches[0].clientX - touchStart;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (touchStart !== null) {
      if (dragOffset < -50) {
        setCurrent((prev) => (prev + 1) % slides.length);
      } else if (dragOffset > 50) {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    setTouchStart(null);
    setDragOffset(0);
    setIsSwiping(false);
  };

  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative px-3 sm:px-6 pt-4 sm:pt-8 pb-8 max-w-5xl mx-auto flex flex-col items-center">
      {/* Editorial Headline */}
      <div className="text-center space-y-2 mb-4 sm:mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display uppercase tracking-tight font-medium">
          JU et Saigon
        </h1>
        <p className="text-xs sm:text-sm font-editorial italic tracking-wider opacity-80 max-w-md mx-auto">
          "Flower your heart, Flower your soul" — Xưởng hoa nghệ thuật Haute Couture giữa lòng Sài Gòn.
        </p>
      </div>

      {/* Hero Canvas Container: 4:5 on iPhone Mobile for tall luxury look, 16:9 on Desktop */}
      <div 
        className={`w-full aspect-[4/5] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl relative select-none touch-pan-y ${
          isDark ? 'bg-[#181916] border-white/15' : 'bg-[#dcd8cf] border-[#141414]/15'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div 
          className="flex w-full h-full will-change-transform transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(calc(-${current * 100}% + ${dragOffset}px), 0, 0)`,
            transition: isSwiping ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {slides.map((slide, idx) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative overflow-hidden">
              <img 
                src={slide.image} 
                alt={slide.titleVi}
                className="w-full h-full object-cover object-center filter grayscale-[5%] transition-transform duration-700 hover:scale-105"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Dark Gradient Overlay for Typography Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-10 text-white">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-amber-300 uppercase mb-1 drop-shadow">
                  Tác phẩm tuyển chọn #{String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-xl sm:text-3xl font-display font-medium tracking-wide drop-shadow-md">
                  {slide.titleVi}
                </h2>
                <p className="text-xs sm:text-sm font-editorial italic text-white/90 max-w-xl mt-1 drop-shadow line-clamp-2">
                  {slide.subtitleVi}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Prev/Next Buttons */}
        <button 
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center transition-all border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center transition-all border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Navigation for iPhone & Desktop */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === i ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Scroll Indicator */}
      <button 
        onClick={onExploreCollection}
        className={`mt-4 sm:mt-6 flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}
      >
        <span>Khám phá bộ sưu tập hoa</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </button>
    </section>
  );
};
