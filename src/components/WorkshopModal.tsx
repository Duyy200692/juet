import React, { useState } from 'react';
import { initialWorkshops } from '../data/workshops';
import { Workshop } from '../types';
import { X, Clock, Users, MapPin, Send, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { initialAtelier } from '../data/atelier';
import { sendWorkshopNotification } from '../services/notificationService';

interface WorkshopModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  onClose: () => void;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({ isOpen, theme, onClose }) => {
  const isDark = theme === 'dark';

  const [bookingWorkshop, setBookingWorkshop] = useState<Workshop | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setBookingWorkshop(null);
    setCustomerName('');
    setCustomerPhone('');
    setPreferredDate('');
    setNote('');
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleStartBooking = (ws: Workshop) => {
    setBookingWorkshop(ws);
    setIsSuccess(false);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingWorkshop) return;
    setIsSubmitting(true);

    const bookingCode = `WS-${Math.floor(1000 + Math.random() * 9000)}`;

    await sendWorkshopNotification({
      bookingCode,
      workshopTitle: bookingWorkshop.titleVi,
      customerName,
      customerPhone,
      preferredDate: preferredDate || undefined,
      note: note || undefined,
      createdAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const openZalo = () => {
    if (!bookingWorkshop) return;
    const msg = `🌿 [ĐĂNG KÝ WORKSHOP CẮM HOA - JU ET SAIGON]
🎨 Khóa học: ${bookingWorkshop.titleVi}
👤 Học viên: ${customerName} - ${customerPhone}
📅 Lịch học mong muốn: ${preferredDate || 'Theo lịch gần nhất của Atelier'}
📝 Ghi chú: ${note || 'Không có'}
━━━━━━━━━━━━━━━━━━`;
    const encoded = encodeURIComponent(msg);
    window.open(`${initialAtelier.zaloUrl}?text=${encoded}`, '_blank');
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
          onClick={handleClose}
          className="w-full flex items-center justify-center pt-3 pb-2 cursor-pointer sm:hidden select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-current opacity-30 hover:opacity-60 transition-opacity" />
        </div>

        {/* Top Header */}
        <div className="px-5 py-3 border-b flex items-center justify-between border-current/10 shrink-0">
          <div className="flex items-center gap-2">
            {bookingWorkshop && (
              <button
                type="button"
                onClick={() => setBookingWorkshop(null)}
                className="p-1 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 mr-1"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-bold">
                WORKSHOP & MASTERCLASSES
              </span>
              <h2 className="text-xl font-display font-medium tracking-tight">
                {bookingWorkshop ? 'Đăng Ký Tham Gia Khóa Học' : 'Các Khóa Học Cắm Hoa Nghệ Thuật'}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-5 pb-safe">
          {isSuccess && bookingWorkshop ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-medium">
                  Đã Tiếp Nhận Đăng Ký Workshop!
                </h3>
                <p className="text-xs font-sans opacity-85 max-w-md mx-auto leading-relaxed">
                  Cảm ơn bạn <strong className="font-semibold">{customerName}</strong>. Atelier đã nhận được thông tin đăng ký cho khóa{' '}
                  <strong className="text-amber-600 dark:text-amber-400 font-semibold">{bookingWorkshop.titleVi}</strong>. Nghệ nhân sẽ liên hệ qua SĐT{' '}
                  <strong className="font-mono">{customerPhone}</strong> để gửi lịch biểu chi tiết.
                </p>
              </div>

              <div className="space-y-2 pt-3 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={openZalo}
                  className="w-full min-h-[46px] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Mở Zalo Xác Nhận Suất Học</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 text-xs font-mono opacity-70 hover:opacity-100"
                >
                  Hoàn tất & Đóng
                </button>
              </div>
            </div>
          ) : bookingWorkshop ? (
            <form onSubmit={handleSubmitBooking} className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 flex items-center gap-3">
                <img src={bookingWorkshop.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block">
                    #{bookingWorkshop.indexNumber} · {bookingWorkshop.duration}
                  </span>
                  <h4 className="font-display font-medium text-sm truncate">{bookingWorkshop.titleVi}</h4>
                  <p className="text-xs opacity-75 truncate">{bookingWorkshop.locationVi}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                    Họ Và Tên Học Viên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                  Thời Gian Bạn Tiện Tham Gia
                </label>
                <input
                  type="text"
                  placeholder="VD: Chiều Thứ Bảy hoặc Chủ Nhật tuần này"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                  Ghi Chú Cho Lớp Học (nếu có)
                </label>
                <input
                  type="text"
                  placeholder="VD: Đi cùng 2 người bạn, tổ chức riêng cho công ty..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full min-h-[48px] px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer ${
                    isDark ? 'bg-amber-400 text-black hover:bg-amber-300' : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang Gửi Đăng Ký...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Xác Nhận Giữ Chỗ Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            initialWorkshops.map((ws) => (
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
                    onClick={() => handleStartBooking(ws)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer ${
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};
