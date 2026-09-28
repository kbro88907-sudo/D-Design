import React from 'react';
import { ArrowLeft, MessageCircle, Sparkles, CheckCircle2, Star, Eye } from 'lucide-react';
import { LogoD } from '../common/LogoD';

interface HeroSectionProps {
  onScrollToPortfolio: () => void;
  whatsappNumber: string;
  whatsappMessage: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToPortfolio,
  whatsappNumber,
  whatsappMessage,
}) => {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 lg:pt-24 lg:pb-36 hero-gradient border-b border-[#1B8F86]/60 text-white">
      {/* 3D Letter "D" Background Decorative Watermark (as requested) */}
      <div className="absolute -top-12 -right-16 lg:right-10 w-[420px] sm:w-[540px] lg:w-[680px] h-[420px] sm:h-[540px] lg:h-[680px] pointer-events-none opacity-20 select-none z-0 transform rotate-[-6deg] transition-transform">
        <LogoD variant="watermark" className="w-full h-full" />
      </div>

      {/* Subtle depth lighting */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#005550]/80 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Text Content */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            {/* Top kicker badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083B3A]/85 border border-[#54DDDE]/50 text-[#3AF0E4] text-xs sm:text-sm font-bold shadow-[3px_3px_0_#083B3A] backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#3AF0E4]" />
              <span>مصمم جرافيك حر معتمد • جاهز لاستقبال مشاريعكم</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight drop-shadow-[0_2px_4px_rgba(8,59,58,0.4)]">
              تصاميم تبني{' '}
              <span className="text-[#3AF0E4] underline decoration-[#54DDDE]/60 decoration-wavy decoration-2">
                هوية علامتك
              </span>{' '}
              وتجذب عملاءك
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-sm">
              من اللوجو والهوية الكاملة لإدارة السوشيال ميديا ومونتاج الريلز، نقدم لك تصاميم احترافية بجودة عالية وتسليم في الموعد.
            </p>

            {/* Two Main Call-To-Action Buttons (Solid 3D depth) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToPortfolio}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 btn-3d-primary px-8 py-3.5 text-base cursor-pointer"
              >
                <Eye className="w-5 h-5 text-[#083B3A]" />
                <span>تصفح أعمالنا</span>
                <ArrowLeft className="w-4 h-4 text-[#083B3A]" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 btn-3d-secondary px-8 py-3.5 text-base bg-[#083B3A]/60 backdrop-blur-sm"
              >
                <MessageCircle className="w-5 h-5 text-[#3AF0E4]" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>

            {/* Key feature check bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-bold text-white/95">
              <div className="flex items-center gap-2 bg-[#083B3A]/40 px-3 py-1.5 rounded-xl border border-[#1B8F86]/50">
                <CheckCircle2 className="w-4 h-4 text-[#3AF0E4]" />
                <span>تسليم سريع ودقيق</span>
              </div>
              <div className="flex items-center gap-2 bg-[#083B3A]/40 px-3 py-1.5 rounded-xl border border-[#1B8F86]/50">
                <CheckCircle2 className="w-4 h-4 text-[#3AF0E4]" />
                <span>ملفات مفتوحة جاهزة للطباعة</span>
              </div>
              <div className="flex items-center gap-2 bg-[#083B3A]/40 px-3 py-1.5 rounded-xl border border-[#1B8F86]/50">
                <CheckCircle2 className="w-4 h-4 text-[#3AF0E4]" />
                <span>تعديلات مرنة ومجانية</span>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase / Stats Card (3D layers) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main 3D Card with top highlight shine and solid shadow */}
              <div className="relative rounded-[26px] bg-[#005550] p-5 sm:p-7 border border-[#1B8F86] shadow-[8px_8px_0_#083B3A] card-gloss-top">
                {/* Visual Designer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1B8F86]/60">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <LogoD size={56} className="shadow-[3px_3px_0_#083B3A]" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3AF0E4] rounded-full border-2 border-[#005550]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">استوديو الإبداع البصري</h3>
                      <p className="text-xs text-[#54DDDE] font-semibold">مصمم أول ومخرج فني</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#083B3A] border border-[#1B8F86] px-3 py-1.5 rounded-2xl text-xs font-bold text-[#3AF0E4] shadow-[2px_2px_0_#083B3A]">
                    <Star className="w-3.5 h-3.5 fill-[#3AF0E4] text-[#3AF0E4]" />
                    <span>4.9 / 5</span>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3 py-4">
                  <div className="bg-[#083B3A]/90 border border-[#1B8F86]/60 rounded-[20px] p-4 text-center shadow-[4px_4px_0_#042221]">
                    <div className="text-2xl sm:text-3xl font-black text-[#54DDDE]">+450</div>
                    <div className="text-xs text-teal-100/90 mt-1 font-semibold">مشروع منجز بنجاح</div>
                  </div>
                  <div className="bg-[#083B3A]/90 border border-[#1B8F86]/60 rounded-[20px] p-4 text-center shadow-[4px_4px_0_#042221]">
                    <div className="text-2xl sm:text-3xl font-black text-[#54DDDE]">+7</div>
                    <div className="text-xs text-teal-100/90 mt-1 font-semibold">سنوات خبرة متواصلة</div>
                  </div>
                  <div className="bg-[#083B3A]/90 border border-[#1B8F86]/60 rounded-[20px] p-4 text-center shadow-[4px_4px_0_#042221]">
                    <div className="text-2xl sm:text-3xl font-black text-[#3AF0E4]">100%</div>
                    <div className="text-xs text-teal-100/90 mt-1 font-semibold">التزام بموعد التسليم</div>
                  </div>
                  <div className="bg-[#083B3A]/90 border border-[#1B8F86]/60 rounded-[20px] p-4 text-center shadow-[4px_4px_0_#042221]">
                    <div className="text-2xl sm:text-3xl font-black text-white">+280</div>
                    <div className="text-xs text-teal-100/90 mt-1 font-semibold">عميل دائم ومؤسسة</div>
                  </div>
                </div>

                {/* Software stack pills */}
                <div className="pt-2">
                  <span className="text-[12px] text-teal-100/80 block mb-2 font-semibold">برامج وأدوات العمل الاحترافية:</span>
                  <div className="flex flex-wrap gap-2">
                    {['Adobe Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'InDesign', 'Midjourney AI', 'Blender 3D'].map((tool) => (
                      <span
                        key={tool}
                        className="bg-[#083B3A] text-teal-100 text-[11px] font-bold px-3 py-1 rounded-xl border border-[#1B8F86]/60 shadow-[2px_2px_0_#042221]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

