import React, { useState } from 'react';
import { Specimen } from '../types';
import { X, Send, Sparkles, MessageSquare, Calendar, User, MapPin } from 'lucide-react';
import { initialAtelier } from '../data/atelier';

interface CommissionModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  selectedFlower: Specimen | null;
  onClose: () => void;
}

export const CommissionModal: React.FC<CommissionModalProps> = ({
  isOpen,
  theme,
  selectedFlower,
  onClose
}) => {
  const isDark = theme === 'dark';

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderCode = `JUET-${Math.floor(1000 + Math.random() * 9000)}`;
    const flowerTitle = selectedFlower ? (selectedFlower.vietnameseName || selectedFlower.name) : 'Thiết Kế Độc Bản Theo Yêu Cầu';

    // Build friendly Zalo message text
    const zaloMsg = `🌸 [ĐẶT HOA ATELIER] - Mã Đơn: ${orderCode}
💐 Tác phẩm: ${flowerTitle}
👤 Khách hàng: ${senderName} - ${senderPhone}
📍 Giao đến: ${recipientName} - ${recipientAddress}
📅 Ngày nhận: ${deliveryDate || 'Càng sớm càng tốt'}
💌 Thiệp sáp: "${cardMessage || 'Không có'}"
📝 Yêu cầu riêng: ${customNote || 'Theo phong cách Atelier'}
━━━━━━━━━━━━━━━━━━`;

    // Open Zalo Atelier link
    const encoded = encodeURIComponent(zaloMsg);
    const zaloUrl = `${initialAtelier.zaloUrl}?text=${encoded}`;
    
    window.open(zaloUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-xl bg-black/70 animate-fadeIn">
      {/* iOS Bottom Sheet Container on iPhone / Centered Modal on Desktop */}
      <div 
        className={`w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] overflow-hidden flex flex-col border shadow-2xl transition-colors duration-300 animate-sheet-up ${
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

        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b flex items-center justify-between border-current/10 shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
              BESPOKE COMMISSION
            </span>
            <h2 className="text-xl font-display font-medium tracking-tight">
              Đặt Thiết Kế Hoa Riêng
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-4">
          {/* Selected Flower Card preview if any */}
          {selectedFlower && (
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5">
              <img 
                src={selectedFlower.image} 
                alt="" 
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-current/10" 
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block">
                  #{selectedFlower.indexNumber} · {selectedFlower.categoryLabelVi}
                </span>
                <p className="font-display font-medium text-sm truncate">
                  {selectedFlower.vietnameseName || selectedFlower.name}
                </p>
                <p className="font-editorial italic text-xs opacity-75 truncate">
                  {selectedFlower.latinName}
                </p>
              </div>
            </div>
          )}

          {/* Sender Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80">
                Tên Của Bạn *
              </label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80">
                Số Điện Thoại / Zalo *
              </label>
              <input
                type="tel"
                required
                placeholder="0901 234 567"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Delivery & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80">
                Tên Người Nhận (nếu tặng)
              </label>
              <input
                type="text"
                placeholder="Để trống nếu tự nhận"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80">
                Ngày & Giờ Giao Hoa
              </label>
              <input
                type="text"
                placeholder="VD: 10h sáng ngày 28/10"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80">
              Địa Chỉ Giao Hoa
            </label>
            <input
              type="text"
              placeholder="Số nhà, tên đường, phường, quận tại TP.HCM"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Wax-sealed Card Message */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80">
              Lời Chúc Viết Tay (Đóng Dấu Sáp Atelier)
            </label>
            <textarea
              rows={2}
              placeholder="Thông điệp yêu thương bạn muốn nắn nót viết trên thiệp..."
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2 pb-safe">
            <button
              type="submit"
              className={`w-full min-h-[48px] px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                isDark
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Gửi Yêu Cầu & Tư Vấn Qua Zalo</span>
            </button>
            <p className="text-[11px] text-center opacity-70 mt-2">
              Atelier sẽ phản hồi, báo giá chi tiết và gửi ảnh hoa thực tế trước khi giao.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
