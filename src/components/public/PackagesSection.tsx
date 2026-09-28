import React from 'react';
import { PricingPackage, TemporaryOffer } from '../../types';
import { Check, Sparkles, ArrowLeft, Tag } from 'lucide-react';

interface PackagesSectionProps {
  packages: PricingPackage[];
  offers: TemporaryOffer[];
  onSelectPackageForOrder: (pkg: PricingPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  offers,
  onSelectPackageForOrder,
}) => {
  // Sort packages by orderIndex
  const sortedPackages = [...packages]
    .filter((p) => p.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // Helper to check if package has an active discount
  const getPackageDiscount = (pkgId: string) => {
    const offer = offers.find(
      (o) =>
        o.isActive &&
        new Date(o.endDate) > new Date() &&
        (o.targetId === pkgId || o.targetType === 'general')
    );
    return offer;
  };

  return (
    <section id="packages" className="py-20 lg:py-28 bg-[#F2FFFE] text-[#083B3A] relative border-b border-[#1B8F86]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B8F86]/15 border border-[#1B8F86]/30 text-[#005550] text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1B8F86]" />
            <span>باقات الأسعار الشفافة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#005550] tracking-tight">
            استثمار واضح ومباشر في نمو علامتك
          </h2>
          <p className="text-[#083B3A]/80 text-base sm:text-lg leading-relaxed font-medium">
            باقات مدروسة بعناية لتناسب كل مرحلة من مراحل عملك، بدون أي تكاليف خفية، مع إمكانية تفصيل باقة مخصصة بالكامل حسب طلبك.
          </p>
        </div>

        {/* Packages Cards Grid with 3D Depth */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {sortedPackages.map((pkg) => {
            const activeOffer = getPackageDiscount(pkg.id);
            const finalPrice = activeOffer?.specialPrice || pkg.price;
            const originalPrice = pkg.originalPrice || pkg.price;
            const hasDiscount = finalPrice < originalPrice;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-[26px] p-7 sm:p-9 transition-all duration-300 card-gloss-top ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#005550] via-[#0d5f5a] to-[#083B3A] text-white border-2 border-[#54DDDE] shadow-[10px_10px_0_#083B3A] lg:-translate-y-3'
                    : 'bg-white text-[#083B3A] border-2 border-[#1B8F86]/25 shadow-[8px_8px_0_rgba(8,59,58,0.14)] hover:shadow-[10px_10px_0_rgba(8,59,58,0.22)]'
                }`}
              >
                {/* Popular or Offer Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-4 right-8 inline-flex items-center gap-1.5 bg-[#54DDDE] text-[#083B3A] text-xs font-black px-4 py-1.5 rounded-full shadow-[3px_3px_0_#083B3A] border-t border-t-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#083B3A]" />
                    <span>الأكثر طلباً</span>
                  </div>
                )}

                {/* Offer tag banner if discount applies */}
                {activeOffer && (
                  <div className={`mb-4 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl ${
                    pkg.isPopular ? 'bg-[#3AF0E4]/20 border border-[#3AF0E4]/40 text-[#3AF0E4]' : 'bg-[#1B8F86]/15 border border-[#1B8F86]/30 text-[#005550]'
                  }`}>
                    <Tag className="w-3.5 h-3.5" />
                    <span>مشمولة بخصم العرض المؤقت!</span>
                  </div>
                )}

                <div>
                  <h3 className={`text-2xl font-black ${pkg.isPopular ? 'text-white' : 'text-[#083B3A]'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`mt-2 text-xs sm:text-sm leading-relaxed min-h-[3rem] font-medium ${
                    pkg.isPopular ? 'text-teal-100/80' : 'text-[#083B3A]/75'
                  }`}>
                    {pkg.description}
                  </p>

                  {/* Pricing Display */}
                  <div className={`my-6 pb-6 border-b ${pkg.isPopular ? 'border-[#1B8F86]/50' : 'border-[#1B8F86]/20'}`}>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-black ${pkg.isPopular ? 'text-[#3AF0E4]' : 'text-[#005550]'}`}>
                        {finalPrice.toLocaleString('ar-EG')}
                      </span>
                      <span className={`font-bold text-sm ${pkg.isPopular ? 'text-teal-200' : 'text-[#083B3A]/70'}`}>
                        ج.م / للمشروع
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className={`line-through font-semibold ${pkg.isPopular ? 'text-teal-300/70' : 'text-[#083B3A]/50'}`}>
                          {originalPrice.toLocaleString('ar-EG')} ج.م
                        </span>
                        <span className="bg-[#2ECC71]/20 text-[#2ECC71] font-black px-2 py-0.5 rounded-lg border border-[#2ECC71]/40">
                          وفر {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <span className={`text-xs font-black uppercase tracking-wider block ${
                      pkg.isPopular ? 'text-[#54DDDE]' : 'text-[#005550]'
                    }`}>
                      المميزات المتضمنة بالباقة:
                    </span>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm font-semibold ${
                          pkg.isPopular ? 'text-teal-100' : 'text-[#083B3A]'
                        }`}>
                          <div className={`mt-0.5 p-1 rounded-xl shrink-0 ${
                            pkg.isPopular ? 'bg-[#3AF0E4]/20 text-[#3AF0E4]' : 'bg-[#1B8F86]/15 text-[#1B8F86]'
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Order CTA Button */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => onSelectPackageForOrder(pkg)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm font-black cursor-pointer ${
                      pkg.isPopular
                        ? 'btn-3d-primary'
                        : 'btn-3d-secondary !text-[#083B3A] !border-[#1B8F86] hover:!bg-[#54DDDE]/20 hover:!text-[#005550]'
                    }`}
                  >
                    <span>اطلب هذه الباقة الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom package notice */}
        <div className="mt-14 p-6 sm:p-8 bg-white border-2 border-[#1B8F86]/30 rounded-[24px] shadow-[6px_6px_0_rgba(8,59,58,0.12)] text-center max-w-2xl mx-auto card-gloss-top">
          <p className="text-sm sm:text-base text-[#083B3A] font-bold">
            💡 <strong>تحتاج باقة مخصصة تجمع بين خدمات معينة؟</strong> لا تتردد في مراسلتي لتفصيل باقة شهرية أو مشروع خاص يناسب ميزانيتك تماماً.
          </p>
        </div>
      </div>
    </section>
  );
};

