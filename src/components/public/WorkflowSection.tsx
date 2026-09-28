import React from 'react';
import { MessageSquareText, Palette, CheckCircle2, ArrowLeft, Sparkles, Send } from 'lucide-react';

interface WorkflowSectionProps {
  onStartOrder?: () => void;
  whatsappNumber: string;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({
  onStartOrder,
  whatsappNumber,
}) => {
  const steps = [
    {
      stepNumber: '01',
      title: 'تواصل معنا',
      desc: 'أخبرنا بالخدمة اللي محتاجها وتفاصيل فكرتك.',
      details: 'نستمع لمتطلباتك وندرس رؤيتك البصرية والجمهور المستهدف لنحدد أنسب حل وإطار زمني.',
      icon: MessageSquareText,
      badge: 'الخطوة الأولى',
      accentColor: 'from-[#54DDDE]/20 to-[#54DDDE]/5',
      borderColor: 'group-hover:border-[#3AF0E4]',
      iconColor: 'text-[#3AF0E4] bg-[#083B3A] border-[#1B8F86]',
      numberColor: 'text-[#54DDDE]/30 group-hover:text-[#54DDDE]/60',
    },
    {
      stepNumber: '02',
      title: 'نصمم لك',
      desc: 'نبدأ التنفيذ ونرسل لك النسخة الأولى.',
      details: 'يبدأ العمل الإبداعي بدقة واحترافية، ونشارك معك المسودة الأولية لأخذ انطباعك وملاحظاتك.',
      icon: Palette,
      badge: 'الخطوة الثانية',
      accentColor: 'from-[#3AF0E4]/20 to-[#3AF0E4]/5',
      borderColor: 'group-hover:border-[#3AF0E4]',
      iconColor: 'text-[#54DDDE] bg-[#083B3A] border-[#1B8F86]',
      numberColor: 'text-[#3AF0E4]/30 group-hover:text-[#3AF0E4]/60',
    },
    {
      stepNumber: '03',
      title: 'تعديل وتسليم',
      desc: 'نعدّل حسب ملاحظاتك ونسلّمك الملفات النهائية.',
      details: 'ننفذ التعديلات المطلوبة حتى تصل للنتيجة المثالية، ونسلّمك الملفات بجميع الصيغ الأصلية المفتوحة والجاهزة.',
      icon: CheckCircle2,
      badge: 'الخطوة الثالثة',
      accentColor: 'from-[#1B8F86]/30 to-[#1B8F86]/10',
      borderColor: 'group-hover:border-[#3AF0E4]',
      iconColor: 'text-[#3AF0E4] bg-[#083B3A] border-[#1B8F86]',
      numberColor: 'text-[#1B8F86]/40 group-hover:text-[#1B8F86]/70',
    },
  ];

  return (
    <section id="workflow" className="py-20 lg:py-28 relative bg-[#083B3A] text-white overflow-hidden border-b border-[#1B8F86]/40">
      {/* Subtle depth glow in brand turquoise */}
      <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#1B8F86]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005550] border border-[#54DDDE]/30 text-[#3AF0E4] text-xs font-bold mb-4 shadow-[2px_2px_0_#042221]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مسار عمل سلس واحترافي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            طريقة العمل <span className="text-[#3AF0E4] underline decoration-[#54DDDE]/50 decoration-wavy">(3 خطوات)</span>
          </h2>
          <p className="text-teal-100/80 text-base sm:text-lg font-medium">
            رحلة عمل واضحة وشفافة من بداية الفكرة وحتى تسليم الملفات النهائية بأعلى معايير الإتقان.
          </p>
        </div>

        {/* 3 Steps Grid with 3D solid shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-1/2 right-[15%] left-[15%] h-1 bg-gradient-to-l from-[#54DDDE]/40 via-[#3AF0E4]/40 to-[#1B8F86]/40 -translate-y-12 z-0 rounded-full" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="group relative rounded-[26px] bg-[#005550] border border-[#1B8F86] p-8 shadow-[8px_8px_0_#042221] transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0_#042221] z-10 flex flex-col justify-between card-gloss-top"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl border-2 shadow-[3px_3px_0_#042221] flex items-center justify-center transition-transform group-hover:scale-110 ${step.iconColor}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-4xl font-black transition-colors font-mono select-none ${step.numberColor}`}>
                      {step.stepNumber}
                    </span>
                  </div>

                  {/* Badge */}
                  <span className="inline-block text-xs font-bold text-[#3AF0E4] bg-[#083B3A] px-3 py-1 rounded-xl mb-3 border border-[#1B8F86]/60 shadow-[2px_2px_0_#042221]">
                    {step.badge}
                  </span>

                  {/* Title & Desc */}
                  <h3 className="text-2xl font-black text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#3AF0E4] font-bold text-base mb-3 leading-relaxed">
                    {step.desc}
                  </p>
                  <p className="text-teal-100/80 text-sm leading-relaxed font-normal">
                    {step.details}
                  </p>
                </div>

                {/* Step Footer Indicator */}
                <div className="mt-8 pt-4 border-t border-[#1B8F86]/50 flex items-center justify-between text-xs text-teal-200/80 font-bold">
                  <span>المرحلة {idx + 1} من 3</span>
                  <div className="flex gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${idx >= 0 ? 'bg-[#3AF0E4]' : 'bg-[#083B3A]'}`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${idx >= 1 ? 'bg-[#3AF0E4]' : 'bg-[#083B3A]'}`} />
                    <span className={`w-2.5 h-2.5 rounded-full ${idx >= 2 ? 'bg-[#3AF0E4]' : 'bg-[#083B3A]'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar with 3D style */}
        <div className="mt-14 p-6 sm:p-8 rounded-[24px] bg-[#005550] border border-[#1B8F86] shadow-[8px_8px_0_#042221] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right card-gloss-top">
          <div>
            <h4 className="text-2xl font-black text-white mb-1">
              جاهز لبدء مشروعك الآن؟
            </h4>
            <p className="text-teal-100/90 text-sm font-medium">
              تواصل معنا وسنبدأ في تحويل فكرتك إلى تصميم واقعي خلال ساعات.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartOrder}
              className="btn-3d-primary inline-flex items-center gap-2 px-6 py-3 text-sm cursor-pointer"
            >
              <span>اطلب تصميمك الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، أود بدء العمل على مشروعي الجديد معكم')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-secondary inline-flex items-center gap-2 px-5 py-3 text-sm bg-[#083B3A]"
            >
              <Send className="w-4 h-4 text-[#3AF0E4]" />
              <span>محادثة واتساب سريعة</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

