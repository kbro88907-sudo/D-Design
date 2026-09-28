import React, { useState, useMemo } from 'react';
import { PortfolioProject } from '../../types';
import { Eye, Filter, Sparkles } from 'lucide-react';
import { LightboxModal } from '../modals/LightboxModal';

interface PortfolioSectionProps {
  projects: PortfolioProject[];
  onOrderSimilarProject: (project: PortfolioProject) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects,
  onOrderSimilarProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(projects.map((p) => p.category)));
    return ['الكل', ...list];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'الكل') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-[#005550] relative border-b border-[#1B8F86]/40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#083B3A] border border-[#54DDDE]/40 text-[#3AF0E4] text-xs sm:text-sm font-bold shadow-[2px_2px_0_#083B3A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>معرض الأعمال والإبداعات</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            نماذج حية لأعمال صنعت فارقاً لعملائي
          </h2>
          <p className="text-teal-100/80 text-base sm:text-lg leading-relaxed font-medium">
            تصفح أحدث ما أبدعته من هويات متكاملة، بوستات تفاعلية، تصاميم مطبوعات فاخرة، ومونتاج سينمائي. اضغط على أي عمل لمعاينته بحجم كامل.
          </p>
        </div>

        {/* Category Filter Interactive Controls */}
        <div className="mt-10 flex items-center justify-center flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#54DDDE] text-[#083B3A] shadow-[4px_4px_0_#083B3A] -translate-y-0.5 border-t border-t-white/70'
                  : 'bg-[#083B3A] text-teal-100 hover:text-white hover:bg-[#0b4a49] border border-[#1B8F86] shadow-[2px_2px_0_#083B3A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid with 3D solid shadows */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="group relative bg-[#083B3A] rounded-[22px] overflow-hidden border border-[#1B8F86] shadow-[6px_6px_0_#042221] hover:shadow-[9px_9px_0_#042221] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col card-gloss-top"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-[#004843]">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay upon hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#083B3A] via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                {/* Category badge */}
                <div className="absolute top-3 right-3 bg-[#083B3A]/90 backdrop-blur-md text-[#3AF0E4] text-xs font-bold px-3 py-1 rounded-xl border border-[#1B8F86] shadow-[2px_2px_0_#042221]">
                  {project.category}
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-13 h-13 rounded-2xl bg-[#54DDDE] text-[#083B3A] flex items-center justify-center shadow-[4px_4px_0_#083B3A] transform scale-75 group-hover:scale-100 transition-transform">
                    <Eye className="w-6 h-6 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-base text-white group-hover:text-[#3AF0E4] transition-colors line-clamp-2">
                  {project.title}
                </h3>
                
                <div className="mt-4 pt-3 border-t border-[#1B8F86]/30 flex items-center justify-between text-xs text-teal-200/80 font-semibold">
                  <span className="truncate">{project.clientName || 'مشروع معتمد'}</span>
                  <span className="text-[#54DDDE] font-bold">معاينة وتفاصيل ←</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onOrderSimilar={onOrderSimilarProject}
        />
      </div>
    </section>
  );
};

