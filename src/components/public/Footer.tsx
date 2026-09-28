import React from 'react';
import { Phone, MessageCircle, Heart, Lock, Shield } from 'lucide-react';
import { ContactSettings } from '../../types';
import { LogoD } from '../common/LogoD';

interface FooterProps {
  contact: ContactSettings;
  onOpenAuthModal: () => void;
  onOpenDashboard?: () => void;
  isLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  contact,
  onOpenAuthModal,
  onOpenDashboard,
  isLoggedIn,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#005550] border-t border-[#1B8F86]/40 text-teal-100 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col with 3D Letter D Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <LogoD className="w-12 h-12 shadow-[3px_3px_0_#083B3A]" />
              <div>
                <span className="text-lg font-black text-white block">استوديو التصميم</span>
                <span className="text-[11px] text-[#54DDDE] font-bold tracking-wide">FREELANCE GRAPHIC DESIGN</span>
              </div>
            </div>

            <p className="text-xs text-teal-100/80 leading-relaxed font-medium">
              شريكك الإبداعي في بناء الهويات التجارية والتصاميم التسويقية التي تترك أثراً دائماً وتزيد من ثقة عملائك.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="font-black text-white text-base mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <a href="#services" className="text-white hover:text-[#3AF0E4] transition">خدمات التصميم (11 خدمة)</a>
              </li>
              <li>
                <a href="#workflow" className="text-white hover:text-[#3AF0E4] transition">طريقة العمل (3 خطوات)</a>
              </li>
              <li>
                <a href="#portfolio" className="text-white hover:text-[#3AF0E4] transition">معرض الأعمال والمشاريع</a>
              </li>
              <li>
                <a href="#packages" className="text-white hover:text-[#3AF0E4] transition">الباقات والأسعار</a>
              </li>
              <li>
                <a href="#testimonials" className="text-white hover:text-[#3AF0E4] transition">آراء وتقييمات العملاء</a>
              </li>
              <li>
                <a href="#policies" className="text-white hover:text-[#3AF0E4] transition">سياسات وشروط العمل</a>
              </li>
            </ul>
          </div>

          {/* Direct Communication */}
          <div>
            <h4 className="font-black text-white text-base mb-4">التواصل المباشر</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#3AF0E4] shrink-0" />
                <a href={`tel:${contact.primaryPhone}`} className="text-white hover:text-[#3AF0E4] font-mono">
                  {contact.primaryPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#3AF0E4] shrink-0" />
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#3AF0E4]"
                >
                  واتساب: +{contact.whatsappNumber}
                </a>
              </li>
              <li className="text-teal-200/80 text-[11px] pt-1">
                {contact.workingHours}
              </li>
            </ul>
          </div>

          {/* Administration portal link */}
          <div>
            <h4 className="font-black text-white text-base mb-4">بوابة الفريق والإدارة</h4>
            <p className="text-xs text-teal-100/80 mb-4 leading-relaxed font-medium">
              صفحة مخصصة للأدمن لإدارة الطلبات والأسعار، وللمصممين لمتابعة المهام المسندة إليهم.
            </p>

            {isLoggedIn ? (
              <button
                onClick={onOpenDashboard}
                className="btn-3d-primary inline-flex items-center gap-2 px-4 py-2 text-xs cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>الذهاب للوحة التحكم</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="btn-3d-secondary inline-flex items-center gap-2 px-4 py-2.5 text-xs bg-[#083B3A] cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#3AF0E4]" />
                <span>دخول الإدارة والمصممين</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#1B8F86]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-200/80 font-semibold">
          <p>© {currentYear} استوديو التصميم الجرافيكي. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>صُمم وشُيد بأعلى معايير الإتقان والشغف البصري</span>
            <Heart className="w-3.5 h-3.5 text-[#3AF0E4] fill-[#3AF0E4] inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

