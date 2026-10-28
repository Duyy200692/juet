import React, { useState } from 'react';
import { Specimen, CommissionOrder } from '../types';
import { X, Send, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { initialAtelier } from '../data/atelier';
import { sendCommissionNotification } from '../services/notificationService';

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
  onClose,
}) => {
  const isDark = theme === 'dark';

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [customNote, setCustomNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CommissionOrder | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setSenderName('');
    setSenderPhone('');
    setRecipientName('');
    setRecipientAddress('');
    setDeliveryDate('');
    setCardMessage('');
    setCustomNote('');
    setCompletedOrder(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderCode = `JUET-${Math.floor(1000 + Math.random() * 9000)}`;
    const flowerTitle = selectedFlower
      ? selectedFlower.vietnameseName || selectedFlower.name
      : 'Thiết Kế Độc Bản Theo Yêu Cầu';

    const order: CommissionOrder = {
      orderCode,
      senderName,
      senderPhone,
      recipientName: recipientName || undefined,
      recipientAddress: recipientAddress || undefined,
      deliveryDate: deliveryDate || undefined,
      flowerName: flowerTitle,
      flowerIndex: selectedFlower?.indexNumber,
      cardMessage: cardMessage || undefined,
      customNote: customNote || undefined,
      createdAt: new Date().toISOString(),
    };

    // 1. Tự động gửi thông báo đến Telegram Bot & Google Sheets của Atelier
    await sendCommissionNotification(order);

    setIsSubmitting(false);
    setCompletedOrder(order);
  };

  const openZaloChat = () => {
    if (!completedOrder) return;

    const zaloMsg = `🌸 [ĐẶT HOA ATELIER] - Mã Đơn: ${completedOrder.orderCode}
💐 Tác phẩm: ${completedOrder.flowerName}
👤 Khách hàng: ${completedOrder.senderName} - ${completedOrder.senderPhone}
📍 Giao đến: ${completedOrder.recipientName || 'Chính khách nhận'} - ${completedOrder.recipientAddress || 'Ghé lấy tại Atelier'}
📅 Ngày nhận: ${completedOrder.deliveryDate || 'Càng sớm càng tốt'}
💌 Thiệp sáp: "${completedOrder.cardMessage || 'Không ghi thiệp'}"
📝 Yêu cầu riêng: ${completedOrder.customNote || 'Theo phong cách Atelier'}
━━━━━━━━━━━━━━━━━━`;

    const encoded = encodeURIComponent(zaloMsg);
    const zaloUrl = `${initialAtelier.zaloUrl}?text=${encoded}`;
    window.open(zaloUrl, '_blank');
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
          onClick={handleClose}
          className="w-full flex items-center justify-center pt-3 pb-2 cursor-pointer sm:hidden select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-current opacity-30 hover:opacity-60 transition-opacity" />
        </div>

        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b flex items-center justify-between border-current/10 shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-bold">
              BESPOKE COMMISSION
            </span>
            <h2 className="text-xl font-display font-medium tracking-tight">
              {completedOrder ? 'Tiếp Nhận Đơn Thành Công' : 'Đặt Thiết Kế Hoa Riêng'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Either Success Screen OR Input Form */}
        {completedOrder ? (
          <div className="overflow-y-auto overscroll-contain flex-1 p-6 space-y-5 text-center animate-fadeIn pb-safe">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 font-bold">
                MÃ ĐƠN HÀNG: {completedOrder.orderCode}
              </span>
              <h3 className="text-2xl font-display font-medium">
                Yêu Cầu Đã Được Gửi Tới Xưởng Hoa
              </h3>
              <p className="text-xs font-sans opacity-85 leading-relaxed max-w-md mx-auto pt-1">
                Atelier đã nhận được thông tin đặt hoa của bạn. Nghệ nhân sẽ liên hệ lại qua số điện thoại{' '}
                <strong className="text-amber-600 dark:text-amber-400 font-mono">{completedOrder.senderPhone}</strong>{' '}
                để tư vấn và báo giá chi tiết trong ít phút.
              </p>
            </div>

            {/* Order Brief Summary Card */}
            <div className="p-4 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 text-left text-xs font-sans space-y-1.5">
              <div className="flex justify-between">
                <span className="opacity-70">Tác phẩm:</span>
                <span className="font-semibold text-right">{completedOrder.flowerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Người đặt:</span>
                <span className="font-semibold">{completedOrder.senderName}</span>
              </div>
              {completedOrder.deliveryDate && (
                <div className="flex justify-between">
                  <span className="opacity-70">Thời gian nhận:</span>
                  <span className="font-semibold">{completedOrder.deliveryDate}</span>
                </div>
              )}
              {completedOrder.cardMessage && (
                <div className="border-t border-current/10 pt-1.5 mt-1.5">
                  <span className="opacity-70 block mb-0.5">Nội dung thiệp:</span>
                  <span className="italic font-editorial text-sm">"{completedOrder.cardMessage}"</span>
                </div>
              )}
            </div>

            {/* Actions: Direct Zalo Chat Button & Done */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={openZaloChat}
                className="w-full min-h-[48px] px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mở Zalo Nhắn Trực Tiếp Cùng Nghệ Nhân</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-wider opacity-70 hover:opacity-100 cursor-pointer"
              >
                Hoàn tất & Về trang chủ
              </button>
            </div>
          </div>
        ) : (
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
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block font-semibold">
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
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
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
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
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
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
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
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                  Ngày & Giờ Giao Hoa
                </label>
                <input
                  type="text"
                  placeholder="VD: 10h sáng ngày 30/10"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                Địa Chỉ Giao Hoa
              </label>
              <input
                type="text"
                placeholder="Số nhà, tên đường, phường, quận tại TP.HCM (hoặc ghé Atelier nhận)"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Wax-sealed Card Message */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
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

            {/* Custom note */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                Yêu Cầu Riêng Cho Nghệ Nhân (nếu có)
              </label>
              <input
                type="text"
                placeholder="VD: Tone màu pastel nhẹ nhàng, thêm ruy băng lụa ngà..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 pb-safe">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full min-h-[48px] px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer ${
                  isDark
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Tiếp Nhận Yêu Cầu...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Xác Nhận & Gửi Yêu Cầu Cho Atelier</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center opacity-70 mt-2">
                Hệ thống tự động lưu trữ và thông báo ngay đến Nghệ nhân để chuẩn bị hoa tươi cho bạn.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
