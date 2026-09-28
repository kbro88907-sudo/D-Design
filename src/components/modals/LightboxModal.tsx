import React from 'react';
import { PortfolioProject } from '../../types';
import { X, ZoomIn, Calendar, Wrench, User, ArrowLeft } from 'lucide-react';

interface LightboxModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onOrderSimilar: (project: PortfolioProject) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  project,
  onClose,
  onOrderSimilar,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#083B3A]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#005550] border-2 border-[#1B8F86] rounded-[26px] overflow-hidden shadow-[10px_10px_0_#042221] flex flex-col max-h-[92vh] card-gloss-top text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1B8F86]/50 bg-[#083B3A]/60">
          <div className="flex items-center gap-2">
            <span className="bg-[#54DDDE] text-[#083B3A] text-xs font-black px-3 py-1 rounded-xl shadow-[2px_2px_0_#042221]">
              {project.category}
            </span>
            <span className="text-xs text-teal-200 font-semibold">سنة التنفيذ: {project.year}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق المعاينة"
            className="text-teal-200 hover:text-white p-1.5 rounded-xl hover:bg-[#083B3A] transition cursor-pointer border border-[#1B8F86]/40"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Main Large Image */}
          <div className="lg:col-span-8 flex items-center justify-center bg-[#083B3A] rounded-2xl overflow-hidden border border-[#1B8F86]/60 p-2 shadow-inner">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-[4px_4px_0_#042221]"
            />
          </div>

          {/* Details Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {project.title}
              </h3>

              {project.clientName && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-100 font-semibold">
                  <User className="w-4 h-4 text-[#3AF0E4] shrink-0" />
                  <span>العميل: <strong className="text-white">{project.clientName}</strong></span>
                </div>
              )}

              <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed font-medium">
                {project.description}
              </p>

              {/* Tools Used */}
              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold mb-2">
                    <Wrench className="w-3.5 h-3.5 text-[#3AF0E4]" />
                    <span>البرامج المستخدمة:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="bg-[#083B3A] text-[#54DDDE] text-xs font-bold px-3 py-1 rounded-xl border border-[#1B8F86]/60 shadow-[2px_2px_0_#042221]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#083B3A]/80 text-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#1B8F86]/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#1B8F86]/40 space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onOrderSimilar(project);
                }}
                className="btn-3d-primary w-full flex items-center justify-center gap-2 py-3 text-sm cursor-pointer"
              >
                <span>اطلب عملاً مشابهاً لهذا التصميم</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-teal-200 hover:text-white transition cursor-pointer font-bold underline"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
