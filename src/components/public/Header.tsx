import React, { useState } from 'react';
import { Phone, Menu, X, Shield, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { AuthSession } from '../../services/storage';
import { LogoD } from '../common/LogoD';

interface HeaderProps {
  onOpenOrderModal: () => void;
  onOpenAuthModal: () => void;
  authSession: AuthSession;
  onOpenDashboard: () => void;
  contactPhone: string;
  whatsappNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrderModal,
  onOpenAuthModal,
  authSession,
  onOpenDashboard,
  contactPhone,
  whatsappNumber,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'الرئيسية', href: '#hero' },
    { name: 'خدماتي', href: '#services' },
    { name: 'طريقة العمل', href: '#workflow' },
    { name: 'معرض الأعمال', href: '#portfolio' },
    { name: 'الباقات والأسعار', href: '#packages' },
    { name: 'آراء العملاء', href: '#testimonials' },
    { name: 'السياسات', href: '#policies' },
    { name: 'تواصل معنا', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#005550]/95 backdrop-blur-md border-b border-[#1B8F86]/40 shadow-[0_4px_12px_rgba(8,59,58,0.25)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section with 3D Letter D */}
          <a href="#hero" className="flex items-center gap-3 group">
            <LogoD className="w-11 h-11 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#3AF0E4] transition-colors">
                استوديو التصميم
              </span>
              <span className="text-[11px] text-[#54DDDE] font-semibold tracking-wide">
                FREELANCE GRAPHIC DESIGN
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/90 hover:text-[#3AF0E4] hover:bg-[#1B8F86]/30 px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all duration-150"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Direct WhatsApp Pill */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل فوري عبر واتساب"
              className="p-2.5 text-[#54DDDE] hover:text-[#3AF0E4] hover:bg-[#1B8F86]/40 rounded-2xl transition-all border border-[#1B8F86]/60 shadow-[2px_2px_0_#083B3A]"
              title="تواصل مباشر عبر واتساب"
            >
              <MessageCircle className="w-5 h-5 text-[#3AF0E4]" />
            </a>

            {/* Quick Order Button - 3D Primary Button */}
            <button
              onClick={onOpenOrderModal}
              className="btn-3d-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer"
            >
              <span>اطلب الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Admin / Worker Portal Button */}
            {authSession.role !== 'guest' ? (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-1.5 bg-[#083B3A] hover:bg-[#0b4a49] text-[#54DDDE] border border-[#1B8F86] font-bold px-3.5 py-2.5 rounded-2xl text-xs shadow-[3px_3px_0_#083B3A] transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#3AF0E4]" />
                <span>{authSession.role === 'admin' ? 'لوحة الأدمن' : 'لوحة مهامي'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="p-2.5 text-white/80 hover:text-[#3AF0E4] hover:bg-[#1B8F86]/40 rounded-2xl transition cursor-pointer border border-[#1B8F86]/60 shadow-[2px_2px_0_#083B3A]"
                title="تسجيل دخول الإدارة والمصممين"
                aria-label="تسجيل دخول الإدارة والمصممين"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenOrderModal}
              className="btn-3d-primary text-xs px-3.5 py-1.5"
            >
              اطلب
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#3AF0E4] rounded-xl hover:bg-[#1B8F86]/40 transition cursor-pointer"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#005550] border-b border-[#1B8F86] px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#1B8F86]/40">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white hover:text-[#3AF0E4] hover:bg-[#1B8F86]/40 px-3 py-2 rounded-xl text-sm font-bold transition"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderModal();
              }}
              className="btn-3d-primary w-full flex items-center justify-center gap-2 py-3 text-sm"
            >
              <span>اطلب تصميم جديد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#083B3A] text-[#3AF0E4] border border-[#1B8F86] font-bold py-2.5 rounded-2xl text-sm shadow-[3px_3px_0_#083B3A]"
            >
              <MessageCircle className="w-4 h-4 text-[#3AF0E4]" />
              <span>محادثة واتساب سريعة</span>
            </a>

            <div className="pt-2 flex items-center justify-between text-xs text-teal-200/80">
              <span>هاتف: {contactPhone}</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (authSession.role !== 'guest') onOpenDashboard();
                  else onOpenAuthModal();
                }}
                className="text-[#3AF0E4] underline font-bold cursor-pointer"
              >
                {authSession.role !== 'guest' ? 'فتح لوحة التحكم' : 'دخول الإدارة / المصمم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

