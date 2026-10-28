import React, { useState } from 'react';
import { Specimen } from '../types';
import { X, Sparkles, ArrowRight, RotateCcw, Check } from 'lucide-react';

interface SommelierModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  flowers: Specimen[];
  onClose: () => void;
  onSelectFlower: (flower: Specimen) => void;
  onCommission: (flower: Specimen) => void;
}

export const SommelierModal: React.FC<SommelierModalProps> = ({
  isOpen,
  theme,
  flowers,
  onClose,
  onSelectFlower,
  onCommission
}) => {
  const isDark = theme === 'dark';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [occasion, setOccasion] = useState<string>('bridal');
  const [colorMood, setColorMood] = useState<string>('white');

  if (!isOpen) return null;

  const occasions = [
    { id: 'bridal', title: 'Lễ Cưới & Kỷ Niệm Tình Yêu', desc: 'Mẫu đơn trắng, dạ lan hương, ngọc trai baroque' },
    { id: 'installation', title: 'Kiến Trúc Không Gian & Triển Lãm', desc: 'Sen cung đình, vanda xanh chàm, dáng cành uốn lượn' },
    { id: 'rare', title: 'Quà Tặng Đối Tác & Tuyệt Tác Quý Hiếm', desc: 'Lan hồ điệp hoàng gia, cúc mẫu đơn vàng hoàng tộc' },
    { id: 'seasonal', title: 'Chữa Lành Tâm Hồn & Thư Thái Mỗi Ngày', desc: 'Mao lương bướm, hoa hồng Ohara, hương hoa thảo mộc' }
  ];

  const colors = [
    { id: 'white', title: 'Trắng Tinh Khôi & Kem Ngà', bg: 'bg-[#faf8f5] text-black border-slate-300' },
    { id: 'blush', title: 'Hồng Phấn & Lãng Mạn Cổ Điển', bg: 'bg-rose-100 text-rose-950 border-rose-300' },
    { id: 'noir', title: 'Đỏ Rượu Vang & Đen Obsidian', bg: 'bg-stone-900 text-white border-stone-700' },
    { id: 'blue', title: 'Xanh Chàm Đêm & Vàng Hoàng Cung', bg: 'bg-blue-950 text-amber-200 border-blue-800' }
  ];

  // Match flowers based on selections
  const recommendations = flowers.filter((f) => {
    if (occasion === 'bridal') return f.category === 'bridal' || f.name.includes('PEONY');
    if (occasion === 'installation') return f.category === 'installation' || f.name.includes('LOTUS');
    if (occasion === 'rare') return f.category === 'rare' || f.name.includes('PHALAENOPSIS');
    return f.category === 'seasonal' || f.category === 'vase';
  }).slice(0, 3);

  const reset = () => {
    setStep(1);
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
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
              Floral Sommelier AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={reset}
                className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5"
                title="Làm lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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

        {/* Content Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  BƯỚC 1 / 2
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-medium tracking-tight">
                  Tác phẩm này sẽ đồng hành cùng sự kiện nào?
                </h3>
                <p className="text-xs font-sans opacity-80 mt-1">
                  Mỗi tạo tác hoa mang theo một tần số cảm xúc và cấu trúc kiến trúc khác biệt.
                </p>
              </div>

              <div className="space-y-2.5">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => {
                      setOccasion(occ.id);
                      setStep(2);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 ${
                      occasion === occ.id
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-current/15 hover:border-current/30 bg-black/5 dark:bg-white/5'
                    }`}
                  >
                    <div>
                      <h4 className="font-display font-medium text-sm sm:text-base">
                        {occ.title}
                      </h4>
                      <p className="text-xs opacity-75 mt-0.5">
                        {occ.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  BƯỚC 2 / 2
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-medium tracking-tight">
                  Tông màu và tâm trạng bạn hướng đến?
                </h3>
                <p className="text-xs font-sans opacity-80 mt-1">
                  Chọn sắc thái để Nghệ nhân bắt trọn nguồn cảm hứng thẩm mỹ của bạn.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setColorMood(c.id);
                      setStep(3);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.99] ${c.bg} flex items-center justify-between shadow-sm`}
                  >
                    <span className="font-display font-medium text-sm">
                      {c.title}
                    </span>
                    <Check className="w-4 h-4 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                  KẾT QUẢ GỢI Ý RIÊNG CHO BẠN
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-medium tracking-tight mt-0.5">
                  Các Tác Phẩm Hòa Hợp Cảm Xúc Nhất
                </h3>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl border border-current/15 bg-black/5 dark:bg-white/5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                  >
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-full sm:w-24 h-40 sm:h-24 rounded-xl object-cover shrink-0 border border-current/10"
                    />

                    <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                        #{rec.indexNumber} · {rec.categoryLabelVi}
                      </span>
                      <h4 className="font-display font-medium text-base">
                        {rec.vietnameseName || rec.name}
                      </h4>
                      <p className="font-editorial italic text-xs opacity-75">
                        {rec.latinName}
                      </p>
                      <p className="text-xs font-sans opacity-85 line-clamp-2 pt-0.5">
                        {rec.shortDescriptionVi}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectFlower(rec);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-current/20 text-xs font-mono uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Chi Tiết
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onCommission(rec);
                        }}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-sm ${
                          isDark
                            ? 'bg-amber-400 text-black hover:bg-amber-300'
                            : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                        }`}
                      >
                        Tư Vấn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Safe Area Footer */}
        <div className="p-3 border-t border-current/10 pb-safe shrink-0 text-center">
          <p className="text-[10px] font-mono opacity-60">
            JU et Saigon · Bespoke Haute Couture Floristry Consultation
          </p>
        </div>
      </div>
    </div>
  );
};
