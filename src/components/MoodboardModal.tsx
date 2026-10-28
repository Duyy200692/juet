import React from 'react';
import { Specimen } from '../types';
import { X, Trash2, Send, Sparkles, Heart } from 'lucide-react';
import { initialAtelier } from '../data/atelier';

interface MoodboardModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  wishlistFlowers: Specimen[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelectFlower: (flower: Specimen) => void;
  onClose: () => void;
}

export const MoodboardModal: React.FC<MoodboardModalProps> = ({
  isOpen,
  theme,
  wishlistFlowers,
  onRemove,
  onClear,
  onSelectFlower,
  onClose
}) => {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleConsult = () => {
    if (wishlistFlowers.length === 0) return;

    const itemsSummary = wishlistFlowers
      .map((f, i) => `${i + 1}. #${f.indexNumber} - ${f.vietnameseName || f.name}`)
      .join('\n');

    const msg = `🎨 [TƯ VẤN MOODBOARD CÁ NHÂN - JU ET SAIGON]
Chào Atelier, mình đã tuyển chọn ${wishlistFlowers.length} tác phẩm trong Moodboard:
${itemsSummary}

Nhờ Atelier tư vấn phối hoa và thiết kế độc bản theo phong cách này giúp mình nhé!
━━━━━━━━━━━━━━━━━━`;

    const encoded = encodeURIComponent(msg);
    window.open(`${initialAtelier.zaloUrl}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-xl bg-black/70 animate-fadeIn">
      {/* iOS Bottom Sheet Container on iPhone / Centered Modal on Desktop */}
      <div 
        className={`w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] overflow-hidden flex flex-col border shadow-2xl transition-colors duration-300 animate-sheet-up ${
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
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
              Bảng Cảm Hứng Cá Nhân ({wishlistFlowers.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {wishlistFlowers.length > 0 && (
              <button
                onClick={onClear}
                className="text-[11px] font-mono opacity-70 hover:opacity-100 hover:text-rose-500 transition-colors"
                title="Xóa tất cả"
              >
                Xóa hết
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-4">
          {wishlistFlowers.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Heart className="w-10 h-10 mx-auto opacity-30" />
              <p className="font-display text-base font-medium">
                Moodboard Của Bạn Đang Trống
              </p>
              <p className="text-xs font-sans opacity-70 max-w-sm mx-auto">
                Chạm vào biểu tượng trái tim trên bất kỳ tác phẩm hoa nào để lưu lại và tạo bảng cảm hứng riêng cho bạn.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wishlistFlowers.map((flower) => (
                <div
                  key={flower.id}
                  className="group relative rounded-2xl overflow-hidden border border-current/15 aspect-[3/4] bg-black/5 dark:bg-white/5 cursor-pointer shadow-sm"
                  onClick={() => {
                    onClose();
                    onSelectFlower(flower);
                  }}
                >
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(flower.id);
                      }}
                      className="p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                      title="Xóa khỏi Moodboard"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute inset-x-2 bottom-2 p-2 rounded-xl bg-black/75 backdrop-blur-md text-white">
                    <p className="text-[10px] font-mono text-amber-300">
                      #{flower.indexNumber}
                    </p>
                    <p className="text-xs font-display font-medium truncate">
                      {flower.vietnameseName || flower.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Footer with Safe Area */}
        {wishlistFlowers.length > 0 && (
          <div className="p-4 border-t border-current/10 pb-safe shrink-0 bg-inherit space-y-2">
            <button
              onClick={handleConsult}
              className={`w-full min-h-[46px] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                isDark
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Gửi Toàn Bộ Moodboard Cho Atelier ({wishlistFlowers.length})</span>
            </button>
            <p className="text-[10px] font-mono opacity-60 text-center">
              Atelier sẽ tư vấn bảng màu, loài hoa thay thế tương đương theo mùa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
