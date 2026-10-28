import { CommissionOrder, WorkshopBooking, NotificationSettings } from '../types';

const SETTINGS_KEY = 'juet_notification_settings';
const ORDERS_STORAGE_KEY = 'juet_atelier_orders';
const BOOKINGS_STORAGE_KEY = 'juet_atelier_bookings';

export const defaultNotificationSettings: NotificationSettings = {
  telegramBotToken: '',
  telegramChatId: '',
  googleSheetWebhookUrl: '',
  enableTelegram: true,
  enableGoogleSheet: false,
};

export const getNotificationSettings = (): NotificationSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaultNotificationSettings, ...JSON.parse(raw) };
    }
  } catch {}
  return defaultNotificationSettings;
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save notification settings:', err);
  }
};

export const getStoredOrders = (): CommissionOrder[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveOrderLocally = (order: CommissionOrder): void => {
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save order locally:', err);
  }
};

export const getStoredBookings = (): WorkshopBooking[] => {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveBookingLocally = (booking: WorkshopBooking): void => {
  try {
    const existing = getStoredBookings();
    const updated = [booking, ...existing];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save booking locally:', err);
  }
};

/**
 * Gửi thông báo đơn hoa mới tới Telegram Bot và Google Sheets
 */
export async function sendCommissionNotification(order: CommissionOrder): Promise<{
  telegramSuccess: boolean;
  sheetsSuccess: boolean;
}> {
  // 1. Luôn lưu đơn vào máy chủ/local storage trước để đảm bảo không bao giờ mất đơn
  saveOrderLocally(order);

  const settings = getNotificationSettings();
  let telegramSuccess = false;
  let sheetsSuccess = false;

  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // 2. Bắn thông báo Telegram nếu có cấu hình
  if (settings.enableTelegram && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const text = `🌸 *[ĐƠN ĐẶT HOA MỚI - JU ET SAIGON]*
━━━━━━━━━━━━━━━━━━
📋 *Mã Đơn*: \`${order.orderCode}\`
💐 *Tác phẩm*: *${order.flowerName}*
👤 *Khách hàng*: *${order.senderName}*
📞 *Số Điện Thoại*: \`${order.senderPhone}\`
📍 *Người nhận*: ${order.recipientName || 'Chính khách nhận'}
🏠 *Địa chỉ giao*: ${order.recipientAddress || 'Ghé Atelier nhận'}
📅 *Ngày giờ giao*: ${order.deliveryDate || 'Càng sớm càng tốt'}
💌 *Thiệp sáp*: "${order.cardMessage || 'Không ghi thiệp'}"
📝 *Ghi chú riêng*: ${order.customNote || 'Theo phong cách Atelier'}
⏰ *Thời gian đặt*: ${now}
━━━━━━━━━━━━━━━━━━
⚡ *Hành động nhanh*: Hãy gọi hoặc kết bạn Zalo số \`${order.senderPhone}\` để tư vấn cho khách!`;

      const response = await fetch(
        `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegramChatId,
            text,
            parse_mode: 'Markdown',
          }),
        }
      );

      const data = await response.json();
      telegramSuccess = !!data.ok;
      if (!data.ok) {
        console.warn('Telegram send failed:', data);
      }
    } catch (err) {
      console.error('Telegram notification error:', err);
    }
  }

  // 3. Đồng bộ vào Google Sheets nếu có Webhook
  if (settings.enableGoogleSheet && settings.googleSheetWebhookUrl) {
    try {
      await fetch(settings.googleSheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'commission',
          orderCode: order.orderCode,
          senderName: order.senderName,
          senderPhone: order.senderPhone,
          recipientName: order.recipientName || '',
          recipientAddress: order.recipientAddress || '',
          deliveryDate: order.deliveryDate || '',
          flowerName: order.flowerName,
          cardMessage: order.cardMessage || '',
          customNote: order.customNote || '',
          createdAt: now,
        }),
      });
      sheetsSuccess = true;
    } catch (err) {
      console.error('Google Sheets webhook error:', err);
    }
  }

  return { telegramSuccess, sheetsSuccess };
}

/**
 * Gửi thông báo đăng ký Workshop mới tới Telegram Bot
 */
export async function sendWorkshopNotification(booking: WorkshopBooking): Promise<{
  telegramSuccess: boolean;
}> {
  saveBookingLocally(booking);

  const settings = getNotificationSettings();
  let telegramSuccess = false;
  const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  if (settings.enableTelegram && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const text = `🌿 *[ĐĂNG KÝ WORKSHOP MỚI - JU ET SAIGON]*
━━━━━━━━━━━━━━━━━━
📋 *Mã Đăng Ký*: \`${booking.bookingCode}\`
🎨 *Khóa học*: *${booking.workshopTitle}*
👤 *Học viên*: *${booking.customerName}*
📞 *Số Điện Thoại*: \`${booking.customerPhone}\`
📅 *Lịch học mong muốn*: ${booking.preferredDate || 'Theo lịch gần nhất'}
📝 *Ghi chú*: ${booking.note || 'Không có'}
⏰ *Thời gian*: ${now}
━━━━━━━━━━━━━━━━━━`;

      const response = await fetch(
        `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegramChatId,
            text,
            parse_mode: 'Markdown',
          }),
        }
      );

      const data = await response.json();
      telegramSuccess = !!data.ok;
    } catch (err) {
      console.error('Workshop Telegram error:', err);
    }
  }

  return { telegramSuccess };
}

/**
 * Gửi tin nhắn test kiểm tra kết nối Telegram
 */
export async function testTelegramConnection(
  token: string,
  chatId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 *[JU ET SAIGON - KIỂM TRA KẾT NỐI THÀNH CÔNG]*\n\nBot thông báo đơn hàng của Atelier đã hoạt động hoàn hảo! Khi có khách đặt hoa trên website, bạn sẽ nhận được tin nhắn tức thì tại đây.`,
        parse_mode: 'Markdown',
      }),
    });
    const data = await res.json();
    if (data.ok) {
      return { success: true, message: 'Kết nối thành công! Đã gửi tin nhắn test tới Telegram của bạn.' };
    }
    return { success: false, message: data.description || 'Lỗi kết nối từ Telegram.' };
  } catch (err) {
    return { success: false, message: 'Không thể kết nối đến máy chủ Telegram. Hãy kiểm tra lại Bot Token.' };
  }
}
