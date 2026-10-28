import React from 'react';
import { initialAtelier } from '../data/atelier';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  theme: 'light' | 'dark';
  onOpenCommission: () => void;
  onOpenWorkshops: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onOpenCommission, onOpenWorkshops }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark ? 'bg-[#0f100e] text-[#ede9df] border-white/10' : 'bg-[#d2cdc3] text-[#141414] border-[#141414]/10'
    } pb-24 md:pb-12 pt-12 px-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
            {initialAtelier.name}
          </h3>
          <p className="font-editorial italic text-sm opacity-80 leading-relaxed">
            "{initialAtelier.tagline}"
          </p>
          <p className="text-xs font-sans opacity-70 leading-relaxed max-w-sm">
            {initialAtelier.subTaglineVi}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={initialAtelier.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-current/20 hover:border-current/60 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={initialAtelier.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full border border-current/20 hover:border-current/60 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Atelier Contacts & Hours */}
        <div className="space-y-2.5 text-xs font-sans">
          <h4 className="font-mono uppercase tracking-widest text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-3">
            Thông Tin Liên Hệ
          </h4>
          <p className="flex items-start gap-2 opacity-85 leading-relaxed">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>{initialAtelier.addressVi}</span>
          </p>
          <p className="flex items-center gap-2 opacity-85">
            <Phone className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Hotline / Zalo: {initialAtelier.phoneFormatted}</span>
          </p>
          <p className="flex items-center gap-2 opacity-85">
            <Mail className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{initialAtelier.email}</span>
          </p>
          <p className="flex items-center gap-2 opacity-85">
            <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{initialAtelier.hoursVi}</span>
          </p>
        </div>

        {/* Col 3: Direct Actions & Signature */}
        <div className="space-y-3">
          <h4 className="font-mono uppercase tracking-widest text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-3">
            Dịch Vụ Nghệ Thuật
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <button
              onClick={onOpenCommission}
              className="block hover:underline underline-offset-4 opacity-85 hover:opacity-100"
            >
              → Đặt Hoa Thiết Kế Bespoke
            </button>
            <button
              onClick={onOpenWorkshops}
              className="block hover:underline underline-offset-4 opacity-85 hover:opacity-100"
            >
              → Đăng Ký Workshop Doanh Nghiệp & Cá Nhân
            </button>
          </div>
          <div className="p-3.5 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 mt-4">
            <p className="text-[11px] font-editorial italic opacity-85">
              Tất cả các tác phẩm hoa cưới và hoa điêu khắc tại JU et Saigon được tạo tác thủ công độc bản bởi Nghệ nhân cắm hoa.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-4 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono opacity-60 gap-2">
        <p>© 2026 JU et Saigon · Encyclopædia Botanica Digital. All rights reserved.</p>
        <p>Bespoke Haute Couture Atelier · Ho Chi Minh City</p>
      </div>
    </footer>
  );
};
