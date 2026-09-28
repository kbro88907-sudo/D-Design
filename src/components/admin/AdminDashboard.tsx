import React, { useState } from 'react';
import {
  AppDatabaseState,
  PricingPackage,
  TemporaryOffer,
  Announcement,
  PortfolioProject,
  Testimonial,
  UsagePolicy,
  PromptItem,
  DesignerWorker,
  ClientTaskOrder,
  TaskStatus,
  ServiceItem,
} from '../../types';
import {
  addPackage,
  updatePackage,
  deletePackage,
  addOffer,
  updateOffer,
  deleteOffer,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  updateService,
  addPortfolioProject,
  deletePortfolioProject,
  addTestimonial,
  deleteTestimonial,
  updatePolicy,
  updateContactSettings,
  addPrompt,
  updatePrompt,
  deletePrompt,
  autoFormatPrompt,
  FormattedPromptResult,
  addDesigner,
  updateDesigner,
  deleteDesigner,
  createAdminTask,
  updateTaskStatus,
  assignTaskDesigner,
  deleteTask,
  resetToInitialData,
} from '../../services/storage';
import {
  LayoutDashboard,
  Package,
  Tag,
  Megaphone,
  Palette,
  Terminal,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Phone,
  LogOut,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  Search,
  Sliders,
  Database,
  Shield,
  Send,
  Eye,
} from 'lucide-react';
import { LogoD } from '../common/LogoD';

interface AdminDashboardProps {
  dbState: AppDatabaseState;
  onLogout: () => void;
  onReturnToHome: () => void;
}

type AdminTab =
  | 'overview'
  | 'tasks'
  | 'assign_task'
  | 'designers'
  | 'packages'
  | 'offers'
  | 'announcements'
  | 'prompts'
  | 'content'
  | 'firebase_guide';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  dbState,
  onLogout,
  onReturnToHome,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Notification toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ---------------- PACKAGES STATE ----------------
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState(1000);
  const [pkgOriginalPrice, setPkgOriginalPrice] = useState(1500);
  const [pkgBadge, setPkgBadge] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);

  // ---------------- OFFERS STATE ----------------
  const [offerTitle, setOfferTitle] = useState('');
  const [offerTargetType, setOfferTargetType] = useState<'package' | 'service' | 'general'>('package');
  const [offerTargetId, setOfferTargetId] = useState(dbState.packages[0]?.id || '');
  const [offerDiscount, setOfferDiscount] = useState(20);
  const [offerSpecialPrice, setOfferSpecialPrice] = useState(2000);
  const [offerEndDate, setOfferEndDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [offerBadgeText, setOfferBadgeText] = useState('عرض محدود ⚡');

  // ---------------- ANNOUNCEMENTS STATE ----------------
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annLink, setAnnLink] = useState('');
  const [annExpiry, setAnnExpiry] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // ---------------- PROMPTS & AUTO-FORMATTER STATE ----------------
  const [rawPromptInput, setRawPromptInput] = useState('');
  const [promptCategory, setPromptCategory] = useState('شعارات وبراندينج');
  const [promptTitle, setPromptTitle] = useState('');
  const [promptGuide, setPromptGuide] = useState('');
  const [promptFormattedResult, setPromptFormattedResult] = useState<FormattedPromptResult | null>(null);

  // ---------------- DESIGNER REGISTRATION STATE ----------------
  const [designerName, setDesignerName] = useState('');
  const [designerPhone, setDesignerPhone] = useState('');
  const [designerPassword, setDesignerPassword] = useState('');
  const [designerSpecialty, setDesignerSpecialty] = useState('');

  // ---------------- TASK CREATION STATE ----------------
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskClient, setNewTaskClient] = useState('');
  const [newTaskPhone, setNewTaskPhone] = useState('');
  const [newTaskService, setNewTaskService] = useState('الهوية البصرية الكاملة واللوجو');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [newTaskBudget, setNewTaskBudget] = useState(1500);
  const [newTaskDeadline, setNewTaskDeadline] = useState(
    new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]
  );
  const [newTaskDesignerId, setNewTaskDesignerId] = useState('');

  // ---------------- PORTFOLIO UPLOAD STATE ----------------
  const [portTitle, setPortTitle] = useState('');
  const [portCategory, setPortCategory] = useState('هويات بصرية');
  const [portImageUrl, setPortImageUrl] = useState('');
  const [portClient, setPortClient] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portTags, setPortTags] = useState('هوية, لوجو, فيكتور');

  // ---------------- CONTACT SETTINGS STATE ----------------
  const [contactPrimaryPhone, setContactPrimaryPhone] = useState(dbState.contact.primaryPhone);
  const [contactWhatsApp, setContactWhatsApp] = useState(dbState.contact.whatsappNumber);

  // Handlers for Packages
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const featList = pkgFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPackage) {
      updatePackage(editingPackage.id, {
        name: pkgName,
        price: Number(pkgPrice),
        originalPrice: Number(pkgOriginalPrice),
        badge: pkgBadge,
        description: pkgDesc,
        features: featList,
        isPopular: pkgIsPopular,
      });
      showToast('تم تحديث الباقة بنجاح!');
      setEditingPackage(null);
    } else {
      addPackage({
        name: pkgName,
        price: Number(pkgPrice),
        originalPrice: Number(pkgOriginalPrice),
        badge: pkgBadge,
        description: pkgDesc,
        features: featList,
        isPopular: pkgIsPopular,
        orderIndex: dbState.packages.length + 1,
        isActive: true,
      });
      showToast('تمت إضافة الباقة الجديدة بنجاح!');
    }

    setPkgName('');
    setPkgBadge('');
    setPkgDesc('');
    setPkgFeatures('');
  };

  const handleEditPackage = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setPkgName(pkg.name);
    setPkgPrice(pkg.price);
    setPkgOriginalPrice(pkg.originalPrice || pkg.price);
    setPkgBadge(pkg.badge || '');
    setPkgDesc(pkg.description);
    setPkgFeatures(pkg.features.join('\n'));
    setPkgIsPopular(!!pkg.isPopular);
  };

  // Handlers for Offers
  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    addOffer({
      title: offerTitle,
      targetType: offerTargetType,
      targetId: offerTargetType === 'package' ? offerTargetId : undefined,
      discountPercentage: Number(offerDiscount),
      specialPrice: Number(offerSpecialPrice),
      startDate: new Date().toISOString(),
      endDate: new Date(offerEndDate + 'T23:59:59').toISOString(),
      isActive: true,
      bannerBadgeText: offerBadgeText,
    });
    showToast('تم نشر العرض الترويجي المؤقت!');
    setOfferTitle('');
  };

  // Handlers for Announcements
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title: annTitle,
      message: annMessage,
      ctaLink: annLink,
      ctaText: 'تفاصيل العرض',
      expiryDate: new Date(annExpiry + 'T23:59:59').toISOString(),
      isActive: true,
    });
    showToast('تم تفعيل الإعلان في الشريط العلوي للموقع!');
    setAnnTitle('');
    setAnnMessage('');
    setAnnLink('');
  };

  // Smart Auto-Formatter Trigger
  const handleRunAutoFormatter = () => {
    if (!rawPromptInput.trim()) {
      alert('يرجى كتابة نص البرومت أولاً لتحليله وتنسيقه.');
      return;
    }
    const result = autoFormatPrompt(rawPromptInput);
    setPromptFormattedResult(result);
  };

  const handleSaveFormattedPrompt = () => {
    if (!promptTitle.trim() || !rawPromptInput.trim()) {
      alert('يرجى كتابة عنوان البرومت والمحتوى.');
      return;
    }

    const finalPromptText = promptFormattedResult ? promptFormattedResult.formattedEnglish : rawPromptInput;
    const finalGuide = promptGuide || (promptFormattedResult ? `أسلوب فني: ${promptFormattedResult.structuredArabic.artStyle}` : 'برومت عالي الجودة.');

    addPrompt({
      title: promptTitle,
      category: promptCategory,
      promptText: finalPromptText,
      arabicGuide: finalGuide,
      tags: ['Midjourney', promptCategory, 'AI'],
      recommendedModel: 'Midjourney v6.1',
      aspectRatio: promptFormattedResult?.structuredArabic.aspectRatio || '16:9',
    });

    showToast('تم حفظ البرومت في المكتبة العامة!');
    setPromptTitle('');
    setRawPromptInput('');
    setPromptGuide('');
    setPromptFormattedResult(null);
  };

  // Designer Registration
  const handleRegisterDesigner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designerName.trim() || !designerPhone.trim()) {
      alert('يرجى ملء الاسم ورقم الهاتف.');
      return;
    }

    addDesigner({
      name: designerName.trim(),
      phone: designerPhone.trim(),
      password: designerPassword.trim() || '123456',
      isActive: true,
      specialties: designerSpecialty ? designerSpecialty.split(',').map((s) => s.trim()) : ['تصميم جرافيك عام'],
    });

    showToast(`تم إنشاء حساب المصمم ${designerName} بنجاح!`);
    setDesignerName('');
    setDesignerPhone('');
    setDesignerPassword('');
    setDesignerSpecialty('');
  };

  // Task Creation & Assignment
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assigned = dbState.designers.find((d) => d.id === newTaskDesignerId);

    createAdminTask({
      title: newTaskTitle,
      clientName: newTaskClient,
      clientPhone: newTaskPhone,
      serviceCategory: newTaskService,
      details: newTaskDetails,
      budget: Number(newTaskBudget),
      deadline: newTaskDeadline,
      assignedDesignerId: newTaskDesignerId || undefined,
      assignedDesignerName: assigned ? assigned.name : undefined,
      status: newTaskDesignerId ? 'in_progress' : 'new',
    });

    showToast('تم إنشاء المهمة وإسنادها للمصمم بنجاح!');
    setNewTaskTitle('');
    setNewTaskClient('');
    setNewTaskPhone('');
    setNewTaskDetails('');
    setActiveTab('tasks');
  };

  // Portfolio addition
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    addPortfolioProject({
      title: portTitle,
      category: portCategory,
      serviceCategory: 'brand_identity',
      imageUrl: portImageUrl || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      clientName: portClient || 'عميل معتمد',
      description: portDesc,
      tags: portTags.split(',').map((t) => t.trim()),
      toolsUsed: ['Adobe Illustrator', 'Photoshop'],
      year: '2026',
    });

    showToast('تمت إضافة العمل إلى معرض الأعمال!');
    setPortTitle('');
    setPortImageUrl('');
    setPortClient('');
    setPortDesc('');
  };

  // Contact update
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings({
      primaryPhone: contactPrimaryPhone.trim(),
      whatsappNumber: contactWhatsApp.trim(),
    });
    showToast('تم تحديث أرقام التواصل والواتساب في كامل الموقع!');
  };

  return (
    <div className="min-h-screen bg-[#083B3A] text-white flex flex-col font-['Cairo',sans-serif]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1B8F86] text-white font-black px-5 py-3 rounded-2xl shadow-[4px_4px_0_#042221] flex items-center gap-2 animate-in slide-in-from-bottom duration-200 border border-[#3AF0E4]/40">
          <CheckCircle2 className="w-5 h-5 text-[#3AF0E4]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-[#005550] border-b border-[#1B8F86]/50 sticky top-0 z-30 shadow-[0_4px_12px_rgba(8,59,58,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoD size={42} className="shadow-[2px_2px_0_#083B3A]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white">لوحة تحكم الإدارة العليا (Admin)</h1>
                <span className="bg-[#083B3A] text-[#3AF0E4] text-[11px] font-black px-2.5 py-0.5 rounded-full border border-[#1B8F86]">
                  متصل ومحمي
                </span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">إدارة الباقات، العروض، المصممين، وتوزيع المهام</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#004843] border-b border-[#1B8F86]/40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 py-2.5 min-w-max">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
            { id: 'tasks', label: 'متابعة الطلبات', icon: FolderKanban, badge: dbState.tasks.length },
            { id: 'assign_task', label: 'توزيع الشغل', icon: Send },
            { id: 'designers', label: 'إدارة المصممين (العمال)', icon: Users, badge: dbState.designers.length },
            { id: 'packages', label: 'إدارة الباقات', icon: Package },
            { id: 'offers', label: 'العروض المؤقتة', icon: Tag, badge: dbState.offers.filter((o) => o.isActive).length },
            { id: 'announcements', label: 'شريط الإعلانات', icon: Megaphone },
            { id: 'prompts', label: 'مكتبة البرومتات والتنسيق', icon: Terminal },
            { id: 'content', label: 'إدارة المحتوى', icon: Palette },
            { id: 'firebase_guide', label: 'ربط Firebase والأمان', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  isActive
                    ? 'bg-[#54DDDE] text-[#083B3A] shadow-[3px_3px_0_#042221] border-t border-t-white/70'
                    : 'text-teal-100/90 hover:text-white hover:bg-[#005550]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-[#083B3A] text-[#3AF0E4]' : 'bg-[#083B3A] text-teal-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <span className="text-xs text-slate-400 block font-medium">إجمالي الطلبات والمهام</span>
                <div className="text-3xl font-black text-white mt-1">{dbState.tasks.length}</div>
                <span className="text-xs text-amber-400 mt-2 block">
                  {dbState.tasks.filter((t) => t.status === 'in_progress').length} جاري العمل عليها
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <span className="text-xs text-slate-400 block font-medium">فريق المصممين النشط</span>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  {dbState.designers.filter((d) => d.isActive).length}
                </div>
                <span className="text-xs text-slate-400 mt-2 block">
                  من إجمالي {dbState.designers.length} مسجل
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <span className="text-xs text-slate-400 block font-medium">الباقات المعروضة للعملاء</span>
                <div className="text-3xl font-black text-indigo-400 mt-1">
                  {dbState.packages.filter((p) => p.isActive).length}
                </div>
                <span className="text-xs text-emerald-400 mt-2 block">متاحة ومحدثة فوراً</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <span className="text-xs text-slate-400 block font-medium">العروض المؤقتة النشطة</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  {dbState.offers.filter((o) => o.isActive).length}
                </div>
                <span className="text-xs text-slate-400 mt-2 block">مع عداد تنازلي نشط</span>
              </div>
            </div>

            {/* Quick Actions & Recent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">أحدث المهام والطلبات المسجلة</h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    عرض كل المهام ({dbState.tasks.length}) ←
                  </button>
                </div>

                <div className="space-y-3">
                  {dbState.tasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {task.orderNumber}
                          </span>
                          <h4 className="font-bold text-sm text-white">{task.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400">
                          العميل: {task.clientName} ({task.clientPhone}) • المصمم: {task.assignedDesignerName || 'لم يُحدد'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            task.status === 'in_progress'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : task.status === 'delivered'
                              ? 'bg-amber-500/20 text-amber-300'
                              : task.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {task.status === 'in_progress' && 'قيد التنفيذ'}
                          {task.status === 'delivered' && 'تم التسليم'}
                          {task.status === 'completed' && 'مكتملة'}
                          {task.status === 'new' && 'جديدة'}
                        </span>

                        <button
                          onClick={() => setActiveTab('tasks')}
                          className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white"
                        >
                          إدارة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Jump Panel */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                  إجراءات سريعة
                </h3>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('assign_task')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-bold transition text-right"
                  >
                    <span>➕ توزيع مهمة جديدة على مصمم</span>
                    <span>←</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('designers')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-right"
                  >
                    <span>👤 تسجيل مصمم جديد بالهاتف وكلمة المرور</span>
                    <span>←</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('offers')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-right"
                  >
                    <span>⚡ إضافة عرض مؤقت مع عداد تنازلي</span>
                    <span>←</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('prompts')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-right"
                  >
                    <span>✨ التنسيق التلقائي للبرومتات الهندسية</span>
                    <span>←</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من استعادة البيانات التجريبية الافتراضية؟')) {
                        resetToInitialData();
                        showToast('تمت استعادة البيانات الافتراضية!');
                      }
                    }}
                    className="w-full text-xs text-slate-400 hover:text-rose-400 p-2 flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط البيانات التجريبية للموقع</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS & ORDER TRACKING */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-white">متابعة الطلبات وتوزيع الشغل</h2>
                <p className="text-xs text-slate-400">
                  جدول بجميع المهام وحالاتها من البداية وحتى التسليم والاعتماد النهائي
                </p>
              </div>

              <button
                onClick={() => setActiveTab('assign_task')}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>إسناد مهمة جديدة</span>
              </button>
            </div>

            {/* Tasks Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="py-4 px-4">رقم الطلب</th>
                      <th className="py-4 px-4">عنوان المهمة</th>
                      <th className="py-4 px-4">العميل والهاتف</th>
                      <th className="py-4 px-4">المصمم المسؤول</th>
                      <th className="py-4 px-4">الميزانية</th>
                      <th className="py-4 px-4">الموعد النهائي</th>
                      <th className="py-4 px-4">الحالة الحالية</th>
                      <th className="py-4 px-4">مخرجات / إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {dbState.tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          {task.orderNumber}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-white block max-w-xs">{task.title}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">{task.details}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-100 block">{task.clientName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{task.clientPhone}</span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={task.assignedDesignerId || ''}
                            onChange={(e) => assignTaskDesigner(task.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="">غير مسندة</option>
                            {dbState.designers.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4 font-bold text-amber-400">
                          {task.budget ? `${task.budget} ج.م` : 'غير محدد'}
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-300">
                          {task.deadline || '4 أيام'}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateTaskStatus(task.id, e.target.value as TaskStatus)
                            }
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${
                              task.status === 'in_progress'
                                ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                                : task.status === 'delivered'
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : task.status === 'completed'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <option value="new">جديدة</option>
                            <option value="in_progress">قيد التنفيذ</option>
                            <option value="delivered">تم التسليم</option>
                            <option value="completed">مكتملة</option>
                            <option value="cancelled">ملغاة</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {task.deliverableUrl && (
                              <a
                                href={task.deliverableUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition"
                                title="معاينة الملف المسلم"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف المهمة ${task.orderNumber}؟`)) {
                                  deleteTask(task.id);
                                  showToast('تم حذف المهمة');
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="حذف المهمة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGN TASK (توزيع الشغل) */}
        {activeTab === 'assign_task' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-black text-white">توزيع وإسناد مهمة جديدة</h2>
              <p className="text-xs text-slate-400">
                أنشئ مهمة وحدد العميل وتفاصيل المشروع واختر المصمم المسؤول عنها
              </p>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان المهمة <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="مثال: تصميم هوية كاملة لمطعم شاورما"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم العميل</label>
                  <input
                    type="text"
                    required
                    value={newTaskClient}
                    onChange={(e) => setNewTaskClient(e.target.value)}
                    placeholder="م/ طارق"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">هاتف العميل</label>
                  <input
                    type="tel"
                    required
                    value={newTaskPhone}
                    onChange={(e) => setNewTaskPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المصمم المسند إليه</label>
                  <select
                    value={newTaskDesignerId}
                    onChange={(e) => setNewTaskDesignerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">اختيار المصمم...</option>
                    {dbState.designers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialties.join('، ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الميزانية المتفق عليها</label>
                  <input
                    type="number"
                    value={newTaskBudget}
                    onChange={(e) => setNewTaskBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تاريخ التسليم النهائي</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">تفاصيل وبريف المشروع</label>
                <textarea
                  rows={4}
                  required
                  value={newTaskDetails}
                  onChange={(e) => setNewTaskDetails(e.target.value)}
                  placeholder="المواصفات المطلوبة، الألوان، أبعاد التصميم، والملاحظات الهامة للمصمم..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer"
              >
                تأكيد الإسناد وإرسال المهمة للمصمم
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: DESIGNERS MANAGEMENT (إدارة المصممين) */}
        {activeTab === 'designers' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form: Add Designer */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">تسجيل مصمم جديد</h3>
                  <p className="text-xs text-slate-400">
                    ينشئ الأدمن حساب المصمم هنا فقط، ويسجل المصمم دخوله برقمه وكلمة المرور هذه
                  </p>
                </div>

                <form onSubmit={handleRegisterDesigner} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      اسم المصمم بالكامل <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={designerName}
                      onChange={(e) => setDesignerName(e.target.value)}
                      placeholder="مثال: يوسف حسام"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      رقم الهاتف (اسم المستخدم) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={designerPhone}
                      onChange={(e) => setDesignerPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      كلمة المرور المحددة <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={designerPassword}
                      onChange={(e) => setDesignerPassword(e.target.value)}
                      placeholder="مثال: pass1234"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      التخصصات والمهام (مفصولة بفواصل)
                    </label>
                    <input
                      type="text"
                      value={designerSpecialty}
                      onChange={(e) => setDesignerSpecialty(e.target.value)}
                      placeholder="ريلز، هوية بصرية، سوشيال ميديا"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    حفظ وإنشاء حساب المصمم
                  </button>
                </form>
              </div>

              {/* List: Registered Designers */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">قائمة المصممين المسجلين</h3>
                  <span className="text-xs text-amber-400 font-bold font-mono">
                    {dbState.designers.length} مصممين
                  </span>
                </div>

                <div className="space-y-3">
                  {dbState.designers.map((designer) => (
                    <div
                      key={designer.id}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{designer.name}</h4>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                              designer.isActive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {designer.isActive ? 'حساب نشط' : 'معطل'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          هاتف: {designer.phone} • كلمة المرور: {designer.password || '******'}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {designer.specialties.map((spec, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Toggle active button */}
                        <button
                          onClick={() => {
                            updateDesigner(designer.id, { isActive: !designer.isActive });
                            showToast(
                              designer.isActive
                                ? `تم تعطيل حساب ${designer.name}`
                                : `تم تفعيل حساب ${designer.name}`
                            );
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                            designer.isActive
                              ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          }`}
                        >
                          {designer.isActive ? 'تعطيل الحساب' : 'تفعيل'}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف المصمم ${designer.name}؟`)) {
                              deleteDesigner(designer.id);
                              showToast('تم حذف المصمم بنجاح');
                            }
                          }}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PACKAGES MANAGEMENT (إدارة الباقات) */}
        {activeTab === 'packages' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form: Add/Edit Package */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {editingPackage ? 'تعديل بيانات الباقة' : 'إضافة باقة جديدة'}
                  </h3>
                  {editingPackage && (
                    <button
                      onClick={() => setEditingPackage(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePackage} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">اسم الباقة</label>
                    <input
                      type="text"
                      required
                      value={pkgName}
                      onChange={(e) => setPkgName(e.target.value)}
                      placeholder="مثال: باقة السوشيال ميديا الشهرية"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">السعر (ج.م)</label>
                      <input
                        type="number"
                        required
                        value={pkgPrice}
                        onChange={(e) => setPkgPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">السعر الأصلي (قبل الخصم)</label>
                      <input
                        type="number"
                        value={pkgOriginalPrice}
                        onChange={(e) => setPkgOriginalPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">شارة الباقة (Badge)</label>
                    <input
                      type="text"
                      value={pkgBadge}
                      onChange={(e) => setPkgBadge(e.target.value)}
                      placeholder="الأكثر طلباً ⭐ / للمؤسسات"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">وصف الباقة</label>
                    <textarea
                      rows={2}
                      value={pkgDesc}
                      onChange={(e) => setPkgDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      المميزات (اكتب كل ميزة في سطر منفصل)
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={pkgFeatures}
                      onChange={(e) => setPkgFeatures(e.target.value)}
                      placeholder="تصميم لوجو احترافي&#10;ملفات المصدر مفتوحة&#10;تعديلات مجانية..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="popularCheck"
                      checked={pkgIsPopular}
                      onChange={(e) => setPkgIsPopular(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="popularCheck" className="text-xs text-slate-300 cursor-pointer">
                      تمييز كباقة رئيسية موصى بها (Featured)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    {editingPackage ? 'حفظ التعديلات' : 'إضافة الباقة للموقع'}
                  </button>
                </form>
              </div>

              {/* List of current packages */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                  الباقات الحالية المعروضة
                </h3>

                <div className="space-y-4">
                  {dbState.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-bold text-white">{pkg.name}</span>
                          {pkg.badge && (
                            <span className="mr-2 text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                              {pkg.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-amber-400 font-mono">
                            {pkg.price} ج.م
                          </span>
                          <button
                            onClick={() => handleEditPackage(pkg)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`حذف باقة ${pkg.name}؟`)) {
                                deletePackage(pkg.id);
                                showToast('تم حذف الباقة');
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400">{pkg.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pkg.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TEMPORARY OFFERS (العروض المؤقتة) */}
        {activeTab === 'offers' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form: Add Offer */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">إضافة عرض ترويجي مؤقت</h3>
                  <p className="text-xs text-slate-400">
                    العروض تظهر في الشريط العلوي مع عداد تنازلي نشط وينتهي العرض تلقائياً
                  </p>
                </div>

                <form onSubmit={handleAddOffer} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">عنوان العرض</label>
                    <input
                      type="text"
                      required
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                      placeholder="خصم 25% على باقات الهوية والتصميم!"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">نوع الهدف</label>
                      <select
                        value={offerTargetType}
                        onChange={(e) => setOfferTargetType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="package">تطبيق على باقة معينة</option>
                        <option value="general">عرض شامل لجميع الخدمات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">الباقة المستهدفة</label>
                      <select
                        value={offerTargetId}
                        onChange={(e) => setOfferTargetId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {dbState.packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">نسبة الخصم %</label>
                      <input
                        type="number"
                        value={offerDiscount}
                        onChange={(e) => setOfferDiscount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">السعر المخفض الجديد</label>
                      <input
                        type="number"
                        value={offerSpecialPrice}
                        onChange={(e) => setOfferSpecialPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">تاريخ انتهاء العرض</label>
                    <input
                      type="date"
                      required
                      value={offerEndDate}
                      onChange={(e) => setOfferEndDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">نص الشارة العلوية</label>
                    <input
                      type="text"
                      value={offerBadgeText}
                      onChange={(e) => setOfferBadgeText(e.target.value)}
                      placeholder="عرض لفترة محدودة ⚡"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    تفعيل ونشر العرض
                  </button>
                </form>
              </div>

              {/* List of Offers */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                  العروض المسجلة
                </h3>

                <div className="space-y-4">
                  {dbState.offers.map((offer) => {
                    const isExpired = new Date(offer.endDate) <= new Date();
                    return (
                      <div
                        key={offer.id}
                        className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                offer.isActive && !isExpired
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {offer.isActive && !isExpired ? 'نشط الآن' : 'منتهي أو معطل'}
                            </span>
                            <h4 className="font-bold text-white text-sm">{offer.title}</h4>
                          </div>

                          <button
                            onClick={() => {
                              deleteOffer(offer.id);
                              showToast('تم حذف العرض');
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-900">
                          <span>الخصم: <strong>{offer.discountPercentage}%</strong></span>
                          <span>السعر الجديد: <strong>{offer.specialPrice} ج.م</strong></span>
                          <span>ينتهي في: <strong>{offer.endDate.split('T')[0]}</strong></span>
                          <span>
                            الحالة:{' '}
                            <button
                              onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                              className="text-amber-400 underline font-semibold cursor-pointer"
                            >
                              {offer.isActive ? 'إيقاف مؤقت' : 'إعادة تفعيل'}
                            </button>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ANNOUNCEMENTS (شريط الإعلانات) */}
        {activeTab === 'announcements' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form: Add Announcement */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">إضافة إعلان جديد</h3>
                  <p className="text-xs text-slate-400">
                    يظهر في الشريط الإعلاني أعلى الموقع أو عند عدم وجود عروض نشطة
                  </p>
                </div>

                <form onSubmit={handleAddAnnouncement} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الإعلان</label>
                    <input
                      type="text"
                      required
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="افتتاح خدمة مونتاج الريلز بالذكاء الاصطناعي!"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">تفاصيل الإعلان</label>
                    <textarea
                      rows={3}
                      required
                      value={annMessage}
                      onChange={(e) => setAnnMessage(e.target.value)}
                      placeholder="احصل على أول فيديو مجاناً عند طلب باقة السوشيال ميديا..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">رابط الزر (اختياري)</label>
                    <input
                      type="url"
                      value={annLink}
                      onChange={(e) => setAnnLink(e.target.value)}
                      placeholder="https://wa.me/201142519392"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">تاريخ انتهاء الإعلان</label>
                    <input
                      type="date"
                      required
                      value={annExpiry}
                      onChange={(e) => setAnnExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                  >
                    حفظ ونشر الإعلان
                  </button>
                </form>
              </div>

              {/* List: Current Announcements */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                  الإعلانات الحالية
                </h3>

                <div className="space-y-4">
                  {dbState.announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateAnnouncement(ann.id, { isActive: !ann.isActive })
                            }
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              ann.isActive
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {ann.isActive ? 'مفعل' : 'معطل'}
                          </button>
                          <button
                            onClick={() => {
                              deleteAnnouncement(ann.id);
                              showToast('تم حذف الإعلان');
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{ann.message}</p>
                      <span className="text-[11px] text-slate-500 block">
                        ينتهي في: {ann.expiryDate.split('T')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PROMPTS WITH AUTO-FORMATTER (مكتبة البرومتات مع التنسيق التلقائي) */}
        {activeTab === 'prompts' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Intelligent Auto-Formatter Hero Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">
                    خانة "التنسيق التلقائي" للبرومتات الهندسية (AI Prompt Structurer)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    اكتب أو الصق أي برومت تريده؛ ستقوم الأداة بإعادة صياغته في أقسام منظمة (الموضوع، الإضاءة، الأسلوب، الزوايا، المعلمات) مع تنبيهك بالعناصر الناقصة تلقائياً!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Input */}
                <div className="lg:col-span-6 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      عنوان البرومت المرجعي
                    </label>
                    <input
                      type="text"
                      value={promptTitle}
                      onChange={(e) => setPromptTitle(e.target.value)}
                      placeholder="مثال: تصوير تجاري سينمائي لساعة ذكية"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      التصنيف
                    </label>
                    <select
                      value={promptCategory}
                      onChange={(e) => setPromptCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="شعارات وبراندينج">شعارات وبراندينج</option>
                      <option value="تصوير منتجات وأغلفة">تصوير منتجات وأغلفة</option>
                      <option value="سوشيال ميديا">سوشيال ميديا</option>
                      <option value="مناسبات وزفاف">مناسبات وزفاف</option>
                      <option value="ثلاثي الأبعاد وموشن">ثلاثي الأبعاد وموشن</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      نص البرومت الخام (Raw Prompt)
                    </label>
                    <textarea
                      rows={5}
                      value={rawPromptInput}
                      onChange={(e) => setRawPromptInput(e.target.value)}
                      placeholder="اكتب البرومت بالإنجليزية أو العربية هنا، مثال: luxury perfume bottle with water ripples gold background"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRunAutoFormatter}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>تشغيل التنسيق التلقائي وفحص الجودة</span>
                  </button>
                </div>

                {/* Right: Structured Output & Warnings */}
                <div className="lg:col-span-6 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-indigo-400">نتيجة التحليل والتنسيق المنظم</span>
                      {promptFormattedResult && (
                        <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                          درجة الاكتمال: {promptFormattedResult.score}%
                        </span>
                      )}
                    </div>

                    {promptFormattedResult ? (
                      <div className="mt-3 space-y-3 text-xs">
                        {/* Warnings if any */}
                        {promptFormattedResult.warnings.length > 0 && (
                          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-amber-300">
                            <div className="flex items-center gap-1.5 font-bold">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              <span>تنبيهات نقص في البرومت:</span>
                            </div>
                            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90">
                              {promptFormattedResult.warnings.map((w, idx) => (
                                <li key={idx}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Structured Sections */}
                        <div className="space-y-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-[11px] text-slate-400 block font-semibold">🎯 الموضوع الأساسي:</span>
                            <span className="text-white font-bold">{promptFormattedResult.structuredArabic.subject}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block font-semibold">🎨 الأسلوب الفني والمظهر:</span>
                            <span className="text-slate-200">{promptFormattedResult.structuredArabic.artStyle}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block font-semibold">💡 نظام الإضاءة:</span>
                            <span className="text-slate-200">{promptFormattedResult.structuredArabic.lighting}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block font-semibold">📐 أبعاد ومعلمات الريندر:</span>
                            <span className="text-amber-400 font-mono font-bold">
                              AR: {promptFormattedResult.structuredArabic.aspectRatio} | Flags: {promptFormattedResult.structuredArabic.technicalFlags}
                            </span>
                          </div>
                        </div>

                        {/* Final Clean Code */}
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1 font-semibold">النص المنسق النهائي الموصى به:</span>
                          <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/40 font-mono text-[11px] text-indigo-200 break-all select-all">
                            {promptFormattedResult.formattedEnglish}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-500 space-y-2 text-xs">
                        <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                        <p>اضغط على زر التنسيق التلقائي لرؤية التحليل الهيكلي والتنبيهات هنا.</p>
                      </div>
                    )}
                  </div>

                  {promptFormattedResult && (
                    <button
                      type="button"
                      onClick={handleSaveFormattedPrompt}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
                    >
                      حفظ هذا البرومت المنسق ونشره في مكتبة الموقع
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Existing Prompts List in DB */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                البرومتات المعروضة بالموقع حالياً ({dbState.prompts.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbState.prompts.map((prm) => (
                  <div
                    key={prm.id}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                          {prm.category}
                        </span>
                        <button
                          onClick={() => {
                            deletePrompt(prm.id);
                            showToast('تم حذف البرومت');
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-sm text-white mt-1.5">{prm.title}</h4>
                      <p className="font-mono text-xs text-slate-400 line-clamp-2 bg-slate-900/60 p-2 rounded-lg mt-2">
                        {prm.promptText}
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      AR: {prm.aspectRatio || '16:9'} • النموذج: {prm.recommendedModel || 'Midjourney'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CONTENT MANAGEMENT (إدارة المحتوى) */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Phone & WhatsApp Setting */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                تحديث أرقام الهاتف والتواصل
              </h3>
              <form onSubmit={handleSaveContact} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف الرسمي</label>
                  <input
                    type="tel"
                    required
                    value={contactPrimaryPhone}
                    onChange={(e) => setContactPrimaryPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الواتساب مع كود الدولة</label>
                  <input
                    type="tel"
                    required
                    value={contactWhatsApp}
                    onChange={(e) => setContactWhatsApp(e.target.value)}
                    placeholder="201142519392"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  حفظ الأرقام الجديدة
                </button>
              </form>
            </div>

            {/* Add Portfolio Project */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                إضافة عمل جديد لمعرض الأعمال
              </h3>
              <form onSubmit={handleAddPortfolio} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">عنوان العمل</label>
                    <input
                      type="text"
                      required
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      placeholder="تصميم علبة عطر فاخرة"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">التصنيف</label>
                    <input
                      type="text"
                      required
                      value={portCategory}
                      onChange={(e) => setPortCategory(e.target.value)}
                      placeholder="أغلفة ومنتجات / هويات بصرية / ريلز"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">اسم العميل</label>
                    <input
                      type="text"
                      value={portClient}
                      onChange={(e) => setPortClient(e.target.value)}
                      placeholder="براند عطور الرياض"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رابط صورة العمل (Image URL)</label>
                  <input
                    type="url"
                    required
                    value={portImageUrl}
                    onChange={(e) => setPortImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">شرح العمل</label>
                  <textarea
                    rows={2}
                    value={portDesc}
                    onChange={(e) => setPortDesc(e.target.value)}
                    placeholder="تفاصيل المشروع، الأهداف، النتيجة المحققة..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  إضافة المشروع للمعرض
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 10: FIREBASE INTEGRATION & SECURITY RULES GUIDE */}
        {activeTab === 'firebase_guide' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    دليل ربط Firebase وقواعد الأمان المشددة (Security Rules)
                  </h2>
                  <p className="text-xs text-slate-400">
                    خطوات إنشاء مشروع Firebase حقيقي، تفعيل Auth وFirestore، وحماية البيانات
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-base">1. إنشاء مشروع Firebase وتفعيل المنتجات:</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    <li>ادخل إلى <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">Firebase Console</a> وأنشئ مشروعاً جديداً.</li>
                    <li>من القائمة الجانبية: اختر <strong>Authentication</strong> وفعل تسجيل الدخول بـ (Email/Password و Google).</li>
                    <li>اختر <strong>Firestore Database</strong> وأنشئ قاعدة بيانات في وضع الإنتاج (Production).</li>
                    <li>انسخ إعدادات الويب (Web Config) من صفحة Project Settings وادمجها في تطبيقك.</li>
                  </ol>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-base">2. قواعد أمان Firestore (Firestore Security Rules):</h4>
                  <p className="text-xs text-slate-400">
                    تم تضمين ملف <code className="text-amber-300">firestore.rules</code> جاهزاً في المشروع بالصيغة القياسية:
                  </p>
                  <pre className="bg-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed dir-ltr">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default Deny
    match /{document=**} { allow read, write: if false; }

    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && request.auth.token.email == "admin@portfolio.com"; }
    function isAssignedDesigner(designerId) { return isSignedIn() && request.auth.uid == designerId; }

    // Public read collections (Packages, Services, Offers, Portfolio, Testimonials, Policies)
    match /packages/{pkgId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /offers/{offerId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /services/{serviceId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /portfolio/{projId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /prompts/{promptId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /testimonials/{testId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /policies/{policyId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Tasks & Orders (Strict RBAC Isolation)
    match /tasks/{taskId} {
      allow create: if true; // Clients can submit quick orders
      allow read: if isAdmin() || (isSignedIn() && resource.data.assignedDesignerId == request.auth.uid);
      allow update: if isAdmin() || (
        isSignedIn() && 
        resource.data.assignedDesignerId == request.auth.uid &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'deliverableUrl', 'designerNotes', 'updatedAt'])
      );
      allow delete: if isAdmin();
    }

    // Designers workers management
    match /designers/{designerId} {
      allow read, write: if isAdmin();
    }
  }
}`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-base">3. إنشاء حساب الأدمن الأول:</h4>
                  <p>
                    من خلال تبويب <strong>Authentication</strong> في لوحة Firebase، اضغط على "Add user" وسجل الإيميل <code className="text-amber-300">admin@portfolio.com</code> مع كلمة مرور قوية لتفعيل الصلاحيات الكاملة للأدمن.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
