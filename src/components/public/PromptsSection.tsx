import React, { useState } from 'react';
import { PromptItem } from '../../types';
import { Copy, Check, Terminal, Sparkles, Search, Layers, Cpu } from 'lucide-react';

interface PromptsSectionProps {
  prompts: PromptItem[];
}

export const PromptsSection: React.FC<PromptsSectionProps> = ({ prompts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const categories = ['الكل', ...Array.from(new Set(prompts.map((p) => p.category)))];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.arabicGuide.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section id="prompts" className="py-20 lg:py-28 bg-[#005550] relative border-b border-[#1B8F86]/40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083B3A] border border-[#54DDDE]/30 text-[#3AF0E4] text-xs sm:text-sm font-bold shadow-[2px_2px_0_#083B3A]">
            <Terminal className="w-3.5 h-3.5" />
            <span>مكتبة الأوامر والبرومتات</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            برومتات ذكاء اصطناعي احترافية جاهزة للاستخدام
          </h2>
          <p className="text-teal-100/80 text-base sm:text-lg leading-relaxed font-medium">
            مكتبة حصرية من البرومتات الهندسية المختبرة لتوليد تصاميم، شعارات، وصور منتجات مذهلة عبر Midjourney وDALL-E. انسخ البرومت بنقرة واحدة واستمتع بالنتائج!
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو موضوع البرومت..."
              className="w-full bg-[#083B3A] border border-[#1B8F86] rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm text-white placeholder-teal-300/60 focus:outline-none focus:border-[#3AF0E4] transition shadow-inner font-medium"
            />
            <Search className="w-4 h-4 text-teal-300 absolute right-4 top-3.5" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex items-center justify-center flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#54DDDE] text-[#083B3A] shadow-[3px_3px_0_#083B3A] border-t border-t-white/70'
                  : 'bg-[#083B3A] hover:bg-[#0b4a49] text-teal-100 hover:text-white border border-[#1B8F86] shadow-[2px_2px_0_#083B3A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prompts Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredPrompts.map((item) => (
            <div
              key={item.id}
              className="bg-[#083B3A] rounded-[24px] border border-[#1B8F86] hover:border-[#3AF0E4] p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-[6px_6px_0_#042221] space-y-5 card-gloss-top"
            >
              <div className="space-y-3.5">
                {/* Top Badges */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-[#005550] text-[#3AF0E4] border border-[#1B8F86] text-xs font-black px-3 py-1 rounded-xl shadow-[2px_2px_0_#042221]">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-teal-200 font-mono font-bold">
                    {item.recommendedModel && (
                      <span className="bg-[#005550] border border-[#1B8F86]/60 px-2.5 py-1 rounded-lg">
                        {item.recommendedModel}
                      </span>
                    )}
                    {item.aspectRatio && (
                      <span className="bg-[#005550] border border-[#1B8F86]/60 px-2.5 py-1 rounded-lg">
                        AR: {item.aspectRatio}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-xl text-white">{item.title}</h3>

                {/* Prompt code block */}
                <div className="relative rounded-2xl bg-[#004843] border border-[#1B8F86]/60 p-4 font-mono text-xs sm:text-sm text-teal-100 leading-relaxed break-all select-all shadow-inner">
                  <code>{item.promptText}</code>
                </div>

                {/* Arabic Guide */}
                <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed bg-[#005550]/70 p-3.5 rounded-2xl border border-[#1B8F86]/50 font-medium">
                  💡 <strong className="text-white">طريقة الاستخدام:</strong> {item.arabicGuide}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#005550] text-[#54DDDE] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#1B8F86]/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy Button */}
              <div className="pt-2 border-t border-[#1B8F86]/40">
                <button
                  onClick={() => handleCopy(item.id, item.promptText)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    copiedId === item.id
                      ? 'bg-[#1B8F86] text-white shadow-[3px_3px_0_#042221] border border-[#3AF0E4]'
                      : 'btn-3d-primary'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4 text-[#3AF0E4]" />
                      <span>تم نسخ البرومت بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ نص البرومت (Copy Prompt)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
