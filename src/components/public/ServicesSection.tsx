import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import {
  Sparkles,
  LayoutGrid,
  Film,
  PlayCircle,
  UtensilsCrossed,
  Image,
  Package,
  BookOpen,
  HeartHandshake,
  QrCode,
  Palette,
  ArrowLeft,
  Clock,
  Check,
  Search,
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForOrder: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Map icon names to Lucide icons with brand turquoise styling
  const renderIcon = (name: string) => {
    const props = { className: 'w-6 h-6 text-[#1B8F86]' };
    switch (name) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'LayoutGrid':
        return <LayoutGrid {...props} />;
      case 'Film':
        return <Film {...props} />;
      case 'PlayCircle':
        return <PlayCircle {...props} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed {...props} />;
      case 'Image':
        return <Image {...props} />;
      case 'Package':
        return <Package {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'QrCode':
        return <QrCode {...props} />;
      case 'Palette':
      default:
        return <Palette {...props} />;
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.features.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#F2FFFE] text-[#083B3A] relative border-b border-[#1B8F86]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B8F86]/15 border border-[#1B8F86]/30 text-[#005550] text-xs sm:text-sm font-bold shadow-xs">
            <span>خدماتي الإبداعية المتخصصة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#005550] tracking-tight">
            حلول تصميمية تغطي كافة احتياجات مشروعك
          </h2>
          <p className="text-[#083B3A]/80 text-base sm:text-lg leading-relaxed font-medium">
            من الفكرة الأولى وحتى الطباعة والنشر على منصات التواصل، أقدم لك 11 خدمة تصميم متخصصة مبنية على دراسة السوق وسلوك العميل.
          </p>

          {/* Search Filter with 3D inset styling */}
          <div className="pt-2 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن خدمة (مثلاً: ريلز، منيو، هوية، باركود)..."
              className="w-full bg-white border-2 border-[#1B8F86]/30 rounded-2xl py-3 pr-11 pl-4 text-sm text-[#083B3A] placeholder-[#083B3A]/50 focus:outline-none focus:border-[#1B8F86] transition shadow-[3px_3px_0_rgba(8,59,58,0.1)] font-medium"
            />
            <Search className="w-5 h-5 text-[#1B8F86] absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* Services Grid with 3D White Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-[24px] overflow-hidden border border-[#1B8F86]/25 shadow-[8px_8px_0_rgba(8,59,58,0.14)] hover:shadow-[10px_10px_0_rgba(8,59,58,0.22)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 card-gloss-top"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 w-full overflow-hidden bg-[#005550]">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#083B3A]/85 via-transparent to-transparent" />
                  
                  {/* Floating Icon with 3D tactile box */}
                  <div className="absolute top-3.5 right-3.5 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#1B8F86]/30 shadow-[3px_3px_0_#083B3A]">
                    {renderIcon(service.iconName)}
                  </div>

                  {/* Delivery badge */}
                  <div className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 bg-[#005550] text-[#3AF0E4] text-xs font-bold px-3 py-1 rounded-xl border border-[#1B8F86] shadow-[2px_2px_0_#083B3A]">
                    <Clock className="w-3.5 h-3.5 text-[#3AF0E4]" />
                    <span>{service.deliveryDays}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-[#083B3A] group-hover:text-[#1B8F86] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-[#083B3A]/80 text-sm line-clamp-3 leading-relaxed font-normal">
                    {service.shortDesc}
                  </p>

                  {/* Key Features List */}
                  <div className="pt-3 space-y-2 border-t border-[#1B8F86]/15">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#005550]">
                        <Check className="w-4 h-4 text-[#1B8F86] shrink-0 stroke-[3]" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Order CTA */}
              <div className="p-6 pt-0 border-t border-[#1B8F86]/15 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#083B3A]/70 block font-bold">يبدأ من</span>
                  <span className="text-2xl font-black text-[#005550]">{service.startingPrice} <span className="text-xs font-bold text-[#083B3A]/70">ج.م</span></span>
                </div>

                <button
                  onClick={() => onSelectServiceForOrder(service)}
                  className="btn-3d-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  <span>طلب الخدمة</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-[#083B3A]/70 font-semibold">
            <p>لم يتم العثور على خدمات مطابقة للبحث. جرب كلمة أخرى.</p>
          </div>
        )}
      </div>
    </section>
  );
};

