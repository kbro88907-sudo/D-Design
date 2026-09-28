import React, { useState } from 'react';
import { UsagePolicy } from '../../types';
import {
  RotateCcw,
  CreditCard,
  Clock,
  ShieldCheck,
  DollarSign,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface PoliciesSectionProps {
  policies: UsagePolicy[];
}

export const PoliciesSection: React.FC<PoliciesSectionProps> = ({ policies }) => {
  // First item open by default
  const [openIds, setOpenIds] = useState<string[]>([policies[0]?.id || '']);

  const togglePolicy = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getPolicyIcon = (key: string) => {
    const props = { className: 'w-5 h-5 text-[#1B8F86]' };
    switch (key) {
      case 'revisions':
        return <RotateCcw {...props} />;
      case 'payments':
        return <CreditCard {...props} />;
      case 'deadlines':
        return <Clock {...props} />;
      case 'intellectual_property':
        return <ShieldCheck {...props} />;
      case 'refunds':
        return <DollarSign {...props} />;
      default:
        return <HelpCircle {...props} />;
    }
  };

  return (
    <section id="policies" className="py-20 lg:py-28 bg-[#F2FFFE] text-[#083B3A] relative border-b border-[#1B8F86]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B8F86]/15 border border-[#1B8F86]/30 text-[#005550] text-xs sm:text-sm font-bold shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-[#1B8F86]" />
            <span>الشفافية وحفظ الحقوق</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#005550] tracking-tight">
            سياسات وقواعد العمل المنظمة
          </h2>
          <p className="text-[#083B3A]/80 text-base sm:text-lg leading-relaxed font-medium">
            لضمان تجربة عمل احترافية وسلسة للطرفين، وضعنا سياسات واضحة تغطي التعديلات، الدفع، مواعيد التسليم، الملكية الفكرية، والاسترجاع.
          </p>
        </div>

        {/* Accordion List with 3D White Cards */}
        <div className="mt-14 space-y-4">
          {policies.map((policy) => {
            const isOpen = openIds.includes(policy.id);

            return (
              <div
                key={policy.id}
                className={`rounded-[22px] border-2 transition-all duration-200 overflow-hidden card-gloss-top ${
                  isOpen
                    ? 'bg-white border-[#1B8F86] shadow-[8px_8px_0_rgba(8,59,58,0.18)]'
                    : 'bg-white hover:bg-[#F2FFFE] border-[#1B8F86]/30 shadow-[5px_5px_0_rgba(8,59,58,0.1)]'
                }`}
              >
                {/* Header Button */}
                <button
                  onClick={() => togglePolicy(policy.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-right cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-[#F2FFFE] border border-[#1B8F86]/30 shrink-0 shadow-[2px_2px_0_rgba(8,59,58,0.1)]">
                      {getPolicyIcon(policy.key)}
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-[#083B3A]">
                        {policy.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#083B3A]/70 mt-0.5 font-medium">
                        {policy.summary}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-2 rounded-xl bg-[#F2FFFE] border border-[#1B8F86]/30 text-[#1B8F86] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#54DDDE] text-[#083B3A]' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#1B8F86]/15 animate-in fade-in-50 duration-200">
                    <ul className="space-y-3">
                      {policy.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#083B3A] font-semibold">
                          <CheckCircle className="w-4 h-4 text-[#1B8F86] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

