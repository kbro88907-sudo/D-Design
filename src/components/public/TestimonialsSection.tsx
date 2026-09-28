import React, { useState } from 'react';
import { Testimonial } from '../../types';
import { Star, ChevronRight, ChevronLeft, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#083B3A] text-white relative border-b border-[#1B8F86]/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005550] border border-[#54DDDE]/30 text-[#3AF0E4] text-xs sm:text-sm font-bold shadow-[2px_2px_0_#042221]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>شهادات نعتز بها</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            ماذا يقول عملاؤنا وشركاء النجاح؟
          </h2>
          <p className="text-teal-100/80 text-base sm:text-lg leading-relaxed font-medium">
            ثقة عملائنا هي أعظم استثمار نفخر به. إليك تجارب حقيقية لأصحاب مشاريع ومؤسسات وثقوا بنا في بناء هوياتهم وتصاميمهم.
          </p>
        </div>

        {/* Main Testimonial Card / Slider */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="relative bg-[#005550] border border-[#1B8F86] rounded-[26px] p-7 sm:p-11 shadow-[8px_8px_0_#042221] card-gloss-top">
            {/* Top quote icon */}
            <div className="absolute top-6 left-6 text-[#54DDDE]/15">
              <Quote className="w-16 h-16 rotate-180" />
            </div>

            <div className="relative z-10 space-y-6">
              {/* Rating stars */}
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < current.rating
                        ? 'fill-[#3AF0E4] text-[#3AF0E4]'
                        : 'fill-[#083B3A] text-[#083B3A]'
                    }`}
                  />
                ))}
                <span className="mr-2 text-xs font-black text-[#083B3A] bg-[#54DDDE] px-3 py-0.5 rounded-full shadow-[2px_2px_0_#042221]">
                  تقييم 5 نجوم معتمد
                </span>
              </div>

              {/* Comment text */}
              <p className="text-base sm:text-xl lg:text-2xl text-white font-medium leading-relaxed italic">
                "{current.comment}"
              </p>

              {/* Client Info & Project Tag */}
              <div className="pt-6 border-t border-[#1B8F86]/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={current.avatarUrl}
                    alt={current.clientName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#54DDDE] shadow-[3px_3px_0_#042221]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-base sm:text-lg">
                        {current.clientName}
                      </h4>
                      <CheckCircle2 className="w-4 h-4 text-[#3AF0E4]" />
                    </div>
                    <p className="text-xs sm:text-sm text-teal-200 font-medium">
                      {current.clientRole}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="text-xs text-[#3AF0E4] bg-[#083B3A] border border-[#1B8F86] px-3.5 py-1.5 rounded-xl font-bold shadow-[2px_2px_0_#042221]">
                    المشروع: {current.projectType}
                  </span>
                  <span className="text-[11px] text-teal-300/70 mt-1">{current.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Navigation Arrows & Dots */}
          <div className="mt-8 flex items-center justify-between max-w-sm mx-auto">
            <button
              onClick={handlePrev}
              aria-label="الرأي السابق"
              className="p-3 rounded-2xl bg-[#005550] hover:bg-[#0b5c56] text-[#3AF0E4] transition shadow-[3px_3px_0_#042221] cursor-pointer border border-[#1B8F86]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`الانتقال للرأي ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-[#3AF0E4]'
                      : 'w-2.5 bg-[#005550] hover:bg-[#1B8F86]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="الرأي التالي"
              className="p-3 rounded-2xl bg-[#005550] hover:bg-[#0b5c56] text-[#3AF0E4] transition shadow-[3px_3px_0_#042221] cursor-pointer border border-[#1B8F86]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
