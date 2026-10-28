import React from 'react';
import { Sun, Moon, Compass, Heart, Sparkles } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  wishlistCount: number;
  onOpenIndex: () => void;
  onOpenMoodboard: () => void;
  onOpenSommelier: () => void;
  onOpenCommission: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  wishlistCount,
  onOpenIndex,
  onOpenMoodboard,
  onOpenSommelier,
  onOpenCommission
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 border-b ${
      isDark ? 'bg-[#141414]/90 border-white/10 text-[#ede9df]' : 'bg-[#dcd8cf]/90 border-[#141414]/10 text-[#141414]'
    } backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Editorial Subtitle */}
        <div className="flex flex-col text-left cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight uppercase leading-none">
            JU et Saigon
          </span>
          <span className="font-editorial italic text-xs sm:text-sm tracking-wide opacity-80 mt-0.5">
            Encyclopædia Botanica Digital
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider uppercase font-medium">
          <button 
            onClick={onOpenIndex}
            className="hover:opacity-60 transition-opacity flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Bách Khoa Hoa</span>
          </button>
          
          <button 
            onClick={onOpenSommelier}
            className="hover:text-amber-500 transition-colors flex items-center gap-1.5 text-amber-600 dark:text-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gu Hoa Sommelier</span>
          </button>

          <button 
            onClick={onOpenMoodboard}
            className="hover:opacity-60 transition-opacity flex items-center gap-1.5"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Moodboard ({wishlistCount})</span>
          </button>

          <button 
            onClick={onOpenCommission}
            className={`px-4 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-sm ${
              isDark ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
            }`}
          >
            Đặt Thiết Kế
          </button>
        </nav>

        {/* Quick Header Actions (Mobile & Desktop) */}
        <div className="flex items-center gap-2">
          {/* Wishlist Quick Button on Mobile */}
          <button 
            onClick={onOpenMoodboard}
            className={`md:hidden relative p-2 rounded-full border transition-all ${
              isDark ? 'border-white/15 bg-white/5' : 'border-[#141414]/15 bg-[#141414]/5'
            }`}
            aria-label="Moodboard"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full border transition-all duration-200 ${
              isDark ? 'border-white/15 bg-white/5 hover:bg-white/15' : 'border-[#141414]/15 bg-[#141414]/5 hover:bg-[#141414]/15'
            }`}
            title="Đổi giao diện Sáng / Tối"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>
        </div>
      </div>
    </header>
  );
};
