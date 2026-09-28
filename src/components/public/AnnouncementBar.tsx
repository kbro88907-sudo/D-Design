import React, { useState, useEffect } from 'react';
import { TemporaryOffer, Announcement } from '../../types';
import { Sparkles, Clock, ArrowLeft, Megaphone, X } from 'lucide-react';

interface AnnouncementBarProps {
  offers: TemporaryOffer[];
  announcements: Announcement[];
  onSelectOfferAction?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  offers,
  announcements,
  onSelectOfferAction,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  // Get first active offer with valid end date
  const activeOffer = offers.find((o) => o.isActive && new Date(o.endDate) > new Date());
  const activeAnnouncement = announcements.find((a) => a.isActive && new Date(a.expiryDate) > new Date());

  useEffect(() => {
    if (!activeOffer) return;

    const calculateTime = () => {
      const difference = +new Date(activeOffer.endDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [activeOffer]);

  if (!isVisible) return null;
  if (!activeOffer && !activeAnnouncement) return null;

  return (
    <aside aria-label="شريط الإعلانات والعروض الترويجية" className="relative z-40 bg-gradient-to-r from-[#005550] via-[#083B3A] to-[#005550] text-white font-medium text-xs sm:text-sm py-2 px-3 shadow-md border-b border-[#1B8F86]/60">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left/Content section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1">
          {activeOffer ? (
            <>
              <span className="inline-flex items-center gap-1 bg-[#1B8F86] text-[#3AF0E4] font-black px-2.5 py-0.5 rounded-full text-xs shadow-inner border border-[#3AF0E4]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#3AF0E4] animate-pulse" />
                {activeOffer.bannerBadgeText || 'عرض حصري'}
              </span>
              <p className="font-bold text-white truncate max-w-md sm:max-w-xl">
                {activeOffer.title}
              </p>

              {/* Countdown Timer */}
              {!timeLeft.isExpired && (
                <div className="inline-flex items-center gap-1.5 bg-[#005550]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-teal-100 border border-[#1B8F86]/50">
                  <Clock className="w-3.5 h-3.5 text-[#54DDDE]" />
                  <span>ينتهي خلال:</span>
                  <span className="bg-[#083B3A] text-[#3AF0E4] px-1.5 py-0.5 rounded border border-[#1B8F86]/40 font-bold">{timeLeft.days}ي</span>
                  <span>:</span>
                  <span className="bg-[#083B3A] text-[#3AF0E4] px-1.5 py-0.5 rounded border border-[#1B8F86]/40 font-bold">{String(timeLeft.hours).padStart(2, '0')}س</span>
                  <span>:</span>
                  <span className="bg-[#083B3A] text-[#3AF0E4] px-1.5 py-0.5 rounded border border-[#1B8F86]/40 font-bold">{String(timeLeft.minutes).padStart(2, '0')}د</span>
                  <span>:</span>
                  <span className="bg-[#083B3A] text-[#3AF0E4] px-1.5 py-0.5 rounded border border-[#1B8F86]/40 font-bold">{String(timeLeft.seconds).padStart(2, '0')}ث</span>
                </div>
              )}
            </>
          ) : (
            activeAnnouncement && (
              <>
                <span className="inline-flex items-center gap-1 bg-[#1B8F86] text-[#3AF0E4] font-bold px-2.5 py-0.5 rounded-full text-xs border border-[#3AF0E4]/30">
                  <Megaphone className="w-3.5 h-3.5 text-[#3AF0E4]" />
                  إعلان
                </span>
                <p className="font-semibold text-white">{activeAnnouncement.title}</p>
                <span className="hidden md:inline text-teal-100 text-xs">{activeAnnouncement.message}</span>
              </>
            )
          )}
        </div>

        {/* Action Button & Close */}
        <div className="flex items-center gap-2 self-center mr-auto">
          {activeOffer && (
            <button
              onClick={() => {
                if (onSelectOfferAction) onSelectOfferAction();
                else {
                  const el = document.getElementById('packages');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1 bg-[#54DDDE] hover:bg-[#3AF0E4] text-[#083B3A] text-xs font-black px-3.5 py-1 rounded-xl transition shadow-[2px_2px_0_#083B3A] cursor-pointer"
            >
              <span>اغتنم الخصم</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {activeAnnouncement && !activeOffer && activeAnnouncement.ctaLink && (
            <a
              href={activeAnnouncement.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-[#54DDDE] hover:bg-[#3AF0E4] text-[#083B3A] text-xs font-black px-3.5 py-1 rounded-xl transition shadow-[2px_2px_0_#083B3A]"
            >
              <span>{activeAnnouncement.ctaText || 'تفاصيل'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          )}

          <button
            onClick={() => setIsVisible(false)}
            aria-label="إغلاق الشريط"
            className="text-teal-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
