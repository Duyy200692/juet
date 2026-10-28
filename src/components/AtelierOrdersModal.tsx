import React, { useState, useEffect } from 'react';
import { CommissionOrder, WorkshopBooking, NotificationSettings } from '../types';
import { 
  X, 
  Bell, 
  Send, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Settings, 
  ListOrdered, 
  HelpCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { 
  getStoredOrders, 
  getStoredBookings, 
  getNotificationSettings, 
  saveNotificationSettings, 
  testTelegramConnection 
} from '../services/notificationService';

interface AtelierOrdersModalProps {
  isOpen: boolean;
  theme: 'light' | 'dark';
  onClose: () => void;
}

export const AtelierOrdersModal: React.FC<AtelierOrdersModalProps> = ({
  isOpen,
  theme,
  onClose,
}) => {
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [orders, setOrders] = useState<CommissionOrder[]>([]);
  const [bookings, setBookings] = useState<WorkshopBooking[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());

  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrders(getStoredOrders());
      setBookings(getStoredBookings());
      setSettings(getNotificationSettings());
      setTestResult(null);
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveNotificationSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestTelegram = async () => {
    if (!settings.telegramBotToken || !settings.telegramChatId) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập cả Telegram Bot Token và Chat ID trước khi bấm gửi thử.',
      });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await testTelegramConnection(settings.telegramBotToken, settings.telegramChatId);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa lịch sử các đơn hàng đã lưu trên trình duyệt này?')) {
      localStorage.removeItem('juet_atelier_orders');
      localStorage.removeItem('juet_atelier_bookings');
      setOrders([]);
      setBookings([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-xl bg-black/75 animate-fadeIn">
      <div
        className={`w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-[32px] sm:rounded-[36px] overflow-hidden flex flex-col border shadow-2xl transition-colors duration-300 animate-sheet-up ${
          isDark
            ? 'bg-[#151614] text-[#ede9df] border-white/15'
            : 'bg-[#dcd8cf] text-[#141414] border-[#141414]/15'
        }`}
      >
        {/* iOS Drag Handle */}
        <div
          onClick={onClose}
          className="w-full flex items-center justify-center pt-3 pb-2 cursor-pointer sm:hidden select-none"
        >
          <div className="w-12 h-1.5 rounded-full bg-current opacity-30 hover:opacity-60 transition-opacity" />
        </div>

        {/* Top Bar with Tabs */}
        <div className="px-5 py-3 border-b flex items-center justify-between border-current/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
              ATELIER OPERATIONS HUB
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-current/15 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Header Tabs */}
        <div className="px-5 py-2.5 border-b border-current/10 flex items-center gap-2 shrink-0 bg-black/5 dark:bg-white/5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Đơn Đặt Hàng ({orders.length + bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-black font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Cấu Hình Báo Chuông Telegram</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-4 pb-safe">
          {activeTab === 'orders' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-amber-600 dark:text-amber-400 font-bold">
                  DANH SÁCH YÊU CẦU ĐÃ GHI NHẬN TỪ WEBSITE
                </span>

                {orders.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[11px] font-mono text-rose-500 hover:underline flex items-center gap-1 opacity-80 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Xóa lịch sử</span>
                  </button>
                )}
              </div>

              {orders.length === 0 && bookings.length === 0 ? (
                <div className="py-16 text-center space-y-2 border rounded-2xl border-current/10 bg-black/5 dark:bg-white/5">
                  <FileText className="w-10 h-10 mx-auto opacity-30" />
                  <p className="font-display text-base font-medium">Chưa có đơn hàng nào</p>
                  <p className="text-xs font-sans opacity-70">
                    Khi khách đặt hoa trên website, toàn bộ dữ liệu sẽ tự động lưu trữ và hiển thị tại đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Orders */}
                  {orders.map((ord) => (
                    <div
                      key={ord.orderCode}
                      className="p-4 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-current/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-mono font-bold">
                            {ord.orderCode}
                          </span>
                          <span className="font-display font-medium text-sm">
                            {ord.flowerName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono opacity-60">
                          {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-amber-500" />
                          <span>Khách: <strong>{ord.senderName}</strong> ({ord.senderPhone})</span>
                        </p>
                        {ord.recipientName && (
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span>Giao đến: {ord.recipientName} - {ord.recipientAddress}</span>
                          </p>
                        )}
                        {ord.deliveryDate && (
                          <p className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>Ngày giao: {ord.deliveryDate}</span>
                          </p>
                        )}
                      </div>

                      {ord.cardMessage && (
                        <div className="p-2.5 rounded-xl bg-black/10 dark:bg-white/5 text-xs">
                          <span className="opacity-70 font-mono text-[10px] block">Thiệp viết tay:</span>
                          <span className="font-editorial italic">"{ord.cardMessage}"</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Workshop bookings */}
                  {bookings.map((bk) => (
                    <div
                      key={bk.bookingCode}
                      className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-blue-500/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
                            {bk.bookingCode}
                          </span>
                          <span className="font-display font-medium text-sm">
                            Workshop: {bk.workshopTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono opacity-60">
                          {new Date(bk.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <p className="text-xs font-sans">
                        Học viên: <strong>{bk.customerName}</strong> ({bk.customerPhone}) · {bk.preferredDate || 'Theo lịch'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-4 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Cách lấy Telegram Bot Token & Chat ID (1 Phút)</span>
                </div>
                <ol className="text-xs font-sans space-y-1.5 opacity-85 list-decimal list-inside leading-relaxed">
                  <li>
                    Mở app Telegram, tìm kiếm <strong>@BotFather</strong> ➔ bấm <code>/newbot</code> ➔ đặt tên bot (ví dụ: <code>JU et Saigon Bot</code>).
                  </li>
                  <li>
                    Copy mã <strong>HTTP API Token</strong> dài (dạng <code>782348234:AAHqj...</code>) dán vào ô bên dưới.
                  </li>
                  <li>
                    Tìm kiếm bot <strong>@userinfobot</strong> trên Telegram để lấy số <strong>Id</strong> của bạn (ví dụ: <code>123456789</code>) và dán vào ô Chat ID.
                  </li>
                </ol>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  placeholder="VD: 7891234567:AAHxyz1234567890abcdef..."
                  value={settings.telegramBotToken}
                  onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider mb-1 opacity-80 font-medium">
                  Telegram Chat ID Của Bạn Hoặc Nhóm Tiệm
                </label>
                <input
                  type="text"
                  placeholder="VD: 1892837482 hoặc -100192837482"
                  value={settings.telegramChatId}
                  onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-current/20 bg-transparent text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-sans ${
                    testResult.success
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestTelegram}
                  className="px-5 py-2.5 rounded-full border border-current/20 text-xs font-mono uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  {isTesting ? 'Đang Kiểm Tra...' : 'Gửi Thử Tin Nhắn Test'}
                </button>

                <button
                  type="submit"
                  className={`flex-1 px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer ${
                    isDark
                      ? 'bg-amber-400 text-black hover:bg-amber-300'
                      : 'bg-[#141414] text-[#dcd8cf] hover:bg-black'
                  }`}
                >
                  {isSaved ? 'Đã Lưu Cấu Hình ✓' : 'Lưu Cài Đặt Thông Báo'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
