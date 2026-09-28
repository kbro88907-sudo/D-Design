import React, { useState } from 'react';
import { ClientTaskOrder, TaskStatus } from '../../types';
import { updateTaskStatus } from '../../services/storage';
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  LogOut,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  User,
} from 'lucide-react';
import { LogoD } from '../common/LogoD';

interface WorkerDashboardProps {
  designerId: string;
  designerName: string;
  designerPhone?: string;
  tasks: ClientTaskOrder[];
  onLogout: () => void;
  onReturnToHome: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  designerId,
  designerName,
  designerPhone,
  tasks,
  onLogout,
  onReturnToHome,
}) => {
  // Filter ONLY tasks assigned to this specific designer
  const myTasks = tasks.filter((t) => t.assignedDesignerId === designerId);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTaskForDelivery, setSelectedTaskForDelivery] = useState<ClientTaskOrder | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [designerNotes, setDesignerNotes] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // New tasks count for notifications
  const newTasksCount = myTasks.filter((t) => t.status === 'in_progress' || t.status === 'new').length;

  const filteredTasks = myTasks.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleOpenDeliveryModal = (task: ClientTaskOrder) => {
    setSelectedTaskForDelivery(task);
    setDeliverableUrl(task.deliverableUrl || '');
    setDesignerNotes(task.designerNotes || '');
    setSaveSuccessMsg(false);
  };

  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForDelivery) return;

    updateTaskStatus(selectedTaskForDelivery.id, 'delivered', {
      deliverableUrl: deliverableUrl.trim(),
      designerNotes: designerNotes.trim(),
    });

    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSelectedTaskForDelivery(null);
    }, 1500);
  };

  const handleQuickStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
  };

  return (
    <div className="min-h-screen bg-[#083B3A] text-white flex flex-col font-['Cairo',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="bg-[#005550] border-b border-[#1B8F86]/50 sticky top-0 z-30 shadow-[0_4px_12px_rgba(8,59,58,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoD size={42} className="shadow-[2px_2px_0_#083B3A]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white">{designerName}</h1>
                <span className="bg-[#083B3A] text-[#3AF0E4] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#1B8F86]">
                  لوحة المصمم المعتمد
                </span>
              </div>
              <p className="text-xs text-teal-200/80 font-mono">{designerPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Indicator */}
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-[#083B3A] text-[#3AF0E4] border border-[#1B8F86] shadow-[2px_2px_0_#042221]">
                <Bell className="w-5 h-5" />
              </div>
              {newTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#54DDDE] text-[#083B3A] font-black text-xs rounded-full flex items-center justify-center shadow-[1px_1px_0_#042221] animate-bounce">
                  {newTasksCount}
                </span>
              )}
            </div>

            <button
              onClick={onReturnToHome}
              className="text-xs font-bold text-white hover:text-[#3AF0E4] px-3.5 py-2 rounded-xl bg-[#083B3A] hover:bg-[#0b4a49] border border-[#1B8F86] shadow-[2px_2px_0_#042221] transition cursor-pointer"
            >
              عرض الموقع العام
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-[2px_2px_0_#042221]"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome & Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-[#005550] border border-[#1B8F86] rounded-[22px] p-5 shadow-[6px_6px_0_#042221] flex items-center justify-between card-gloss-top">
            <div>
              <span className="text-xs text-teal-200/80 block font-bold">إجمالي المهام المسندة</span>
              <span className="text-3xl font-black text-white">{myTasks.length}</span>
            </div>
            <div className="p-3.5 bg-[#083B3A] text-[#3AF0E4] rounded-2xl border border-[#1B8F86] shadow-[2px_2px_0_#042221]">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="bg-[#005550] border border-[#1B8F86] rounded-[22px] p-5 shadow-[6px_6px_0_#042221] flex items-center justify-between card-gloss-top">
            <div>
              <span className="text-xs text-teal-200/80 block font-bold">مهام جاري العمل عليها</span>
              <span className="text-3xl font-black text-[#54DDDE]">
                {myTasks.filter((t) => t.status === 'in_progress').length}
              </span>
            </div>
            <div className="p-3.5 bg-[#083B3A] text-[#54DDDE] rounded-2xl border border-[#1B8F86] shadow-[2px_2px_0_#042221]">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <div className="bg-[#005550] border border-[#1B8F86] rounded-[22px] p-5 shadow-[6px_6px_0_#042221] flex items-center justify-between card-gloss-top">
            <div>
              <span className="text-xs text-teal-200/80 block font-bold">مهام تم تسليمها بنجاح</span>
              <span className="text-3xl font-black text-[#3AF0E4]">
                {myTasks.filter((t) => t.status === 'delivered' || t.status === 'completed').length}
              </span>
            </div>
            <div className="p-3.5 bg-[#083B3A] text-[#3AF0E4] rounded-2xl border border-[#1B8F86] shadow-[2px_2px_0_#042221]">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#1B8F86]/40">
          <div className="flex items-center gap-2">
            <span className="text-xs text-teal-200 font-bold">تصفية حسب الحالة:</span>
            {[
              { id: 'all', label: 'كافة المهام' },
              { id: 'in_progress', label: 'قيد التنفيذ' },
              { id: 'delivered', label: 'تم التسليم' },
              { id: 'completed', label: 'مكتملة' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-[#54DDDE] text-[#083B3A] shadow-[3px_3px_0_#042221] border-t border-t-white/70'
                    : 'bg-[#005550] text-teal-100 hover:text-white border border-[#1B8F86] shadow-[2px_2px_0_#042221]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-teal-200">
            عدد المهام المعروضة: <strong className="text-white">{filteredTasks.length}</strong>
          </span>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-[#005550]/70 border border-[#1B8F86] rounded-[26px] p-12 text-center space-y-3 shadow-[6px_6px_0_#042221] card-gloss-top">
            <div className="w-16 h-16 bg-[#083B3A] text-[#54DDDE] rounded-2xl flex items-center justify-center mx-auto border border-[#1B8F86] shadow-[3px_3px_0_#042221]">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">لا توجد مهام حالياً في هذا القسم</h3>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-sm mx-auto font-medium">
              ستظهر هنا أي مهام جديدة يسندها الأدمن إليك فور تعيينها مع إشعار فوري.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#005550] border border-[#1B8F86] rounded-[24px] p-6 sm:p-7 shadow-[8px_8px_0_#042221] space-y-5 flex flex-col justify-between card-gloss-top transition-all hover:-translate-y-1"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Order ID + Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#083B3A] bg-[#54DDDE] px-3 py-1 rounded-xl shadow-[2px_2px_0_#042221]">
                      {task.orderNumber}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-xl shadow-[2px_2px_0_#042221] border ${
                        task.status === 'in_progress'
                          ? 'bg-[#083B3A] text-[#3AF0E4] border-[#1B8F86]'
                          : task.status === 'delivered'
                          ? 'bg-[#1B8F86] text-white border-[#3AF0E4]'
                          : task.status === 'completed'
                          ? 'bg-[#005550] text-[#54DDDE] border-[#54DDDE]'
                          : 'bg-[#083B3A] text-teal-200 border-[#1B8F86]'
                      }`}
                    >
                      {task.status === 'in_progress' && '⏳ قيد التنفيذ'}
                      {task.status === 'delivered' && '🚀 تم التسليم (بانتظار العميل)'}
                      {task.status === 'completed' && '✅ مكتملة ومعتمدة'}
                      {task.status === 'new' && '🆕 جديدة'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white leading-snug">{task.title}</h3>

                  {/* Client info & Deadline */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#083B3A] p-3.5 rounded-2xl border border-[#1B8F86]/60 shadow-inner">
                    <div>
                      <span className="text-teal-300/80 block font-bold">العميل:</span>
                      <span className="font-black text-white">{task.clientName}</span>
                    </div>

                    <div>
                      <span className="text-teal-300/80 block font-bold">الموعد النهائي:</span>
                      <div className="flex items-center gap-1 font-black text-[#3AF0E4]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{task.deadline || 'خلال 4 أيام'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Task details */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-[#54DDDE]">تفاصيل المطلوب:</span>
                    <p className="text-xs sm:text-sm text-teal-100 leading-relaxed bg-[#083B3A]/80 p-3.5 rounded-2xl border border-[#1B8F86]/50 max-h-32 overflow-y-auto whitespace-pre-wrap font-medium">
                      {task.details}
                    </p>
                  </div>

                  {/* Admin notes if any */}
                  {task.adminNotes && (
                    <div className="p-3 rounded-2xl bg-[#083B3A] border border-[#3AF0E4]/40 text-[#3AF0E4] text-xs font-semibold shadow-[2px_2px_0_#042221]">
                      <strong>ملاحظة من الإدارة:</strong> {task.adminNotes}
                    </div>
                  )}

                  {/* Current Deliverable link if delivered */}
                  {task.deliverableUrl && (
                    <div className="p-3.5 bg-[#083B3A] border border-[#54DDDE]/50 rounded-2xl text-xs space-y-1.5 shadow-[2px_2px_0_#042221]">
                      <div className="flex items-center justify-between text-[#3AF0E4] font-black">
                        <span>رابط التسليم المرسل:</span>
                        <a
                          href={task.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:underline text-[#54DDDE]"
                        >
                          <span>فتح الملف</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      {task.designerNotes && (
                        <p className="text-teal-200 text-[11px] pt-1 font-medium">
                          <strong>ملاحظاتك:</strong> {task.designerNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[#1B8F86]/50 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenDeliveryModal(task)}
                    className="flex-1 btn-3d-primary flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>تسليم الملف النهائي / تعديل الملاحظات</span>
                  </button>

                  {task.status === 'new' && (
                    <button
                      onClick={() => handleQuickStatusChange(task.id, 'in_progress')}
                      className="btn-3d-secondary text-xs px-4 py-3 cursor-pointer"
                    >
                      بدء التنفيذ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Deliverable Submission Modal */}
      {selectedTaskForDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083B3A]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#005550] border-2 border-[#1B8F86] rounded-[26px] p-6 sm:p-8 shadow-[10px_10px_0_#042221] space-y-5 card-gloss-top text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B8F86]/50">
              <div>
                <h3 className="text-xl font-black text-white">تسليم مخرجات المهمة</h3>
                <span className="text-xs text-[#3AF0E4] font-mono font-black">
                  {selectedTaskForDelivery.orderNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedTaskForDelivery(null)}
                className="text-teal-200 hover:text-white p-1 rounded-xl hover:bg-[#083B3A] transition cursor-pointer border border-[#1B8F86]/40"
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg ? (
              <div className="p-6 text-center space-y-3 bg-[#083B3A] rounded-2xl border border-[#3AF0E4]/40 shadow-[4px_4px_0_#042221]">
                <CheckCircle2 className="w-12 h-12 text-[#3AF0E4] mx-auto" />
                <h4 className="text-xl font-black text-white">تم تسليم المهمة بنجاح!</h4>
                <p className="text-xs sm:text-sm text-teal-100 font-medium">
                  تم تحديث حالة المهمة إلى "تم التسليم" وإشعار الإدارة برابط المخرجات.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveDelivery} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#54DDDE] mb-1.5">
                    رابط الملف النهائي (Google Drive / Dropbox / Behance / WeTransfer) <span className="text-[#3AF0E4]">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-[#083B3A] border border-[#1B8F86] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#3AF0E4] transition font-mono shadow-inner"
                  />
                  <span className="text-[11px] text-teal-200/80 mt-1 block font-medium">
                    تأكد من فتح صلاحيات المشاهدة والتحميل للملفات على الرابط.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#54DDDE] mb-1.5">
                    ملاحظات المصمم وتفاصيل التسليم (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    value={designerNotes}
                    onChange={(e) => setDesignerNotes(e.target.value)}
                    placeholder="مثال: تم تسليم صيغ AI و PNG بخلفية شفافة وتجهيز داي كت الطباعة 300DPI..."
                    className="w-full bg-[#083B3A] border border-[#1B8F86] rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#3AF0E4] transition resize-none leading-relaxed shadow-inner"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForDelivery(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-teal-200 hover:text-white cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="btn-3d-primary flex items-center gap-2 py-3 px-6 text-xs sm:text-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>تأكيد التسليم وحفظ التعديلات</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

