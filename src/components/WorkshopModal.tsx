import React from 'react';
import { initialWorkshops } from '../data/workshops';
import { X, Calendar, Clock, Users, MapPin, Send } from 'lucide-react';
import { initialAtelier } from '../data/atelier';

interface WorkshopModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  onClose: () => void;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({ isOpen, theme, onClose }) => {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleBook = (title: string) => {
    const msg = `🌿 [ĐĂNG KÝ WORKSHOP CẮM HOA - JU ET SAIGON]
Chào Atelier, mình muốn đăng ký tham gia khóa:
"${title}"

Nhờ Atelier gửi thông tin lịch biểu gần nhất và số chỗ còn lại giúp mình nhé!
━━━━━━━━━━━━━━━━━━`;
    const encoded = encodeURIComponent(msg);
    window.open(`${initialAtelier.zaloUrl}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-xl bg-black/70 animate-fadeIn">
      {/* iOS Bottom Sheet Container on iPhone / Centered Modal on Desktop */}
      <div 
        className={`w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] overflow-hidden flex flex-col border shadow-2xl transition-colors duration-300 animate-sheet-up ${
          isDark 
            ? 'bg-[#151614] text-[#ede9df] border-white/15' 
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* iOS Drag Handle Pill */}
        <div 
          onClick={onClose}
          className="w-full flex items-center justify-center pt-3 pb-2 cursor-pointer sm:hidden select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-current opacity-30 hover:opacity-60 transition-opacity" />
        </div>

        {/* Top Header */}
        <div className="px-5 py-3 border-b flex items-center justify-between border-current/10 shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
              WORKSHOP & MASTERCLASSES
            </span>
            <h2 className="text-xl font-display font-medium tracking-tight">
              Các Khóa Học Cắm Hoa Nghệ Thuật
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-5 pb-safe">
          {initialWorkshops.map((ws) => (
            <div
              key={ws.id}
              className="p-4 sm:p-5 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={ws.image}
                  alt={ws.titleVi}
                  className="w-full sm:w-48 h-48 sm:h-36 rounded-xl object-cover shrink-0 border border-current/10"
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                    PROGRAM #{ws.indexNumber}
                  </span>
                  <h3 className="font-display font-medium text-lg leading-tight">
                    {ws.titleVi}
                  </h3>
                  <p className="text-xs font-sans opacity-85 leading-relaxed">
                    {ws.descriptionVi}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-mono opacity-80">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {ws.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-500" />
                      {ws.groupSize}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {ws.locationVi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlights & Booking Button */}
              <div className="border-t border-current/10 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {ws.highlightsVi.map((h, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-current/10 bg-white/40 dark:bg-black/40">
                      ✓ {h}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleBook(ws.titleVi)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0 ${
                    isDark
                      ? 'bg-amber-400 text-black hover:bg-amber-300'
                      : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Đăng Ký Tham Gia</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
