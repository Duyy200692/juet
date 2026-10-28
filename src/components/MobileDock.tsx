import React from 'react';
import { Compass, Sparkles, Heart, Flower2 } from 'lucide-react';

interface MobileDockProps {
  theme: 'light' | 'dark';
  flowerCount: number;
  wishlistCount: number;
  onOpenIndex: () => void;
  onOpenSommelier: () => void;
  onOpenMoodboard: () => void;
  onOpenCommission: () => void;
}

export const MobileDock: React.FC<MobileDockProps> = ({
  theme,
  flowerCount,
  wishlistCount,
  onOpenIndex,
  onOpenSommelier,
  onOpenMoodboard,
  onOpenCommission
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-3 z-40 md:hidden pointer-events-auto select-none">
      <div className={`max-w-md mx-auto rounded-full p-1.5 backdrop-blur-2xl border shadow-2xl flex items-center justify-between gap-1 transition-all duration-300 ${
        isDark 
          ? 'bg-[#181916]/95 text-[#ede9df] border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.6)]' 
          : 'bg-[#dcd8cf]/95 text-[#141414] border-[#141414]/20 shadow-[0_12px_32px_rgba(20,20,20,0.22)]'
      }`}>
        {/* 1. Index Button */}
        <button
          type="button"
          onClick={onOpenIndex}
          className={`h-10 flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 rounded-full active:scale-95 text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
            isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
          }`}
        >
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold truncate">Index ({flowerCount})</span>
        </button>

        {/* 2. Sommelier AI Advisor (Highlighted Gold Button) */}
        <button
          type="button"
          onClick={onOpenSommelier}
          className={`h-10 flex-1 min-w-0 px-2 rounded-full border active:scale-95 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
            isDark 
              ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
              : 'bg-amber-500/20 text-amber-950 border-amber-800/40'
          }`}
          title="Trợ lý chọn gu hoa"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Gu Hoa</span>
        </button>

        {/* 3. Moodboard Button with Heart and Counter Badge */}
        <button
          type="button"
          onClick={onOpenMoodboard}
          className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center relative active:scale-95 transition-all duration-200 cursor-pointer border ${
            wishlistCount > 0 
              ? 'bg-rose-500 text-white border-rose-400 shadow-md' 
              : isDark 
                ? 'bg-white/10 text-white border-white/15' 
                : 'bg-black/10 text-black border-black/15'
          }`}
          aria-label="Moodboard"
        >
          <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-white' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-mono flex items-center justify-center font-bold">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* 4. Commission Order Button */}
        <button
          type="button"
          onClick={onOpenCommission}
          className={`h-10 flex-1 min-w-0 px-3 rounded-full active:scale-95 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-md transition-all duration-200 cursor-pointer ${
            isDark 
              ? 'bg-amber-400 text-black hover:bg-amber-300' 
              : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
          }`}
        >
          <Flower2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Đặt Hoa</span>
        </button>
      </div>
    </div>
  );
};
