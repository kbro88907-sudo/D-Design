import React, { useState } from 'react';
import { ContactSettings, ServiceItem } from '../../types';
import { Phone, MessageCircle, Send, CheckCircle2, Clock, MapPin, Mail, ArrowLeft } from 'lucide-react';
import { createClientQuickOrder } from '../../services/storage';

interface ContactSectionProps {
  contact: ContactSettings;
  services: ServiceItem[];
  prefilledService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contact,
  services,
  prefilledService,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState(prefilledService || 'الهوية البصرية الكاملة واللوجو');
  const [details, setDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsappDirectUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !details.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، وتفاصيل الطلب).');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createClientQuickOrder({
        clientName: name.trim(),
        clientPhone: phone.trim(),
        serviceCategory,
        details: details.trim(),
        budget: budget ? parseFloat(budget) : undefined,
      });

      setSubmittedOrderNumber(order.orderNumber);
      setName('');
      setPhone('');
      setDetails('');
      setBudget('');
    } catch (err) {
      console.error('Failed to submit order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#083B3A] text-white relative border-b border-[#1B8F86]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005550] border border-[#54DDDE]/30 text-[#3AF0E4] text-xs sm:text-sm font-bold shadow-[2px_2px_0_#042221]">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>تواصل وبدء العمل</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            جاهز لتحويل أفكارك إلى واقع مبهر؟
          </h2>
          <p className="text-teal-100/80 text-base sm:text-lg leading-relaxed font-medium">
            راسلني الآن عبر واتساب للرد الفوري، أو املأ نموذج الطلب السريع وسأتواصل معك خلال أقل من ساعتين بمقترح وتكلفة محددة.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Info & Fast WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#005550] border border-[#1B8F86] rounded-[26px] p-7 sm:p-9 shadow-[8px_8px_0_#042221] space-y-6 card-gloss-top">
              <h3 className="text-xl font-black text-white border-b border-[#1B8F86]/50 pb-4">
                قنوات الاتصال المباشرة
              </h3>

              {/* Direct Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp */}
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1B8F86] hover:bg-[#20a79d] text-white font-black py-3.5 px-4 rounded-2xl text-sm shadow-[4px_4px_0_#083B3A] transition-all cursor-pointer border-t border-t-white/40"
                >
                  <MessageCircle className="w-5 h-5 text-[#3AF0E4]" />
                  <span>محادثة واتساب</span>
                </a>

                {/* Direct Call */}
                <a
                  href={`tel:${contact.primaryPhone}`}
                  className="btn-3d-primary flex items-center justify-center gap-2 py-3.5 px-4 text-sm cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span>اتصال هاتفي</span>
                </a>
              </div>

              {/* Details List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#083B3A] border border-[#1B8F86]/60 shadow-[3px_3px_0_#042221]">
                  <div className="w-10 h-10 rounded-xl bg-[#005550] border border-[#54DDDE]/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#3AF0E4]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-teal-200/80 font-bold block">رقم الهاتف الرسمي</span>
                    <a
                      href={`tel:${contact.primaryPhone}`}
                      className="text-base font-bold text-white hover:text-[#3AF0E4] font-mono tracking-wider transition"
                    >
                      {contact.primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#083B3A] border border-[#1B8F86]/60 shadow-[3px_3px_0_#042221]">
                  <div className="w-10 h-10 rounded-xl bg-[#005550] border border-[#54DDDE]/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#3AF0E4]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-teal-200/80 font-bold block">مواعيد استقبال الطلبات</span>
                    <span className="text-sm font-semibold text-teal-100">
                      {contact.workingHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#083B3A] border border-[#1B8F86]/60 shadow-[3px_3px_0_#042221]">
                  <div className="w-10 h-10 rounded-xl bg-[#005550] border border-[#54DDDE]/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#3AF0E4]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-teal-200/80 font-bold block">المقر وتغطية العمل</span>
                    <span className="text-sm font-semibold text-teal-100">
                      {contact.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#083B3A] border border-[#1B8F86]/60 shadow-[3px_3px_0_#042221]">
                  <div className="w-10 h-10 rounded-xl bg-[#005550] border border-[#54DDDE]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#3AF0E4]" />
                  </div>
                  <div>
                    <span className="text-[11px] text-teal-200/80 font-bold block">البريد الإلكتروني للشركات</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm font-semibold text-teal-100 hover:text-[#3AF0E4] transition"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Order Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#005550] border border-[#1B8F86] rounded-[26px] p-7 sm:p-10 shadow-[8px_8px_0_#042221] card-gloss-top">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                نموذج طلب سريع (طلب عرض سعر)
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/80 mb-6 font-medium">
                سجل بياناتك وسيتم تسجيل طلبك فوراً في لوحة العمل لنبدأ التنسيق معك.
              </p>

              {submittedOrderNumber ? (
                <div className="bg-[#083B3A] border border-[#3AF0E4]/40 rounded-2xl p-6 text-center space-y-4 animate-in fade-in duration-300 shadow-[4px_4px_0_#042221]">
                  <div className="w-16 h-16 bg-[#54DDDE]/20 border border-[#54DDDE]/40 rounded-2xl flex items-center justify-center mx-auto text-[#3AF0E4]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">تم استلام طلبك بنجاح!</h4>
                    <p className="text-sm text-teal-100 mt-1 font-semibold">
                      رقم طلبك في النظام هو:{' '}
                      <span className="font-mono font-black text-[#3AF0E4]">{submittedOrderNumber}</span>
                    </p>
                    <p className="text-xs text-teal-200/80 mt-2">
                      تم إدراج طلبك في جدول المهام وسنقوم بالتواصل معك عبر الواتساب لتأكيد التفاصيل.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
                        `مرحباً، قمت للتو بتقديم طلب جديد في الموقع برقم (${submittedOrderNumber}). أود متابعة التفاصيل.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-3d-primary inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تأكيد الطلب الآن عبر واتساب</span>
                    </a>

                    <button
                      onClick={() => setSubmittedOrderNumber(null)}
                      className="text-xs text-teal-200 hover:text-white px-3 py-2 cursor-pointer font-bold underline"
                    >
                      تقديم طلب آخر
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-teal-100 mb-1.5">
                        الاسم الكريم / اسم النشاط <span className="text-[#3AF0E4]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: أحمد عبد الله"
                        className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-3 text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition shadow-inner font-semibold"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-teal-100 mb-1.5">
                        رقم الهاتف أو الواتساب <span className="text-[#3AF0E4]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: 01012345678"
                        className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-3 text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition shadow-inner font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Service Selection */}
                    <div>
                      <label className="block text-xs font-bold text-teal-100 mb-1.5">
                        الخدمة المطلوبة
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#54DDDE] transition cursor-pointer font-semibold"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="باقة الأسعار المتكاملة">باقة الأسعار المتكاملة</option>
                        <option value="طلب خاص وتصميمات مخصصة">طلب خاص وتصميمات مخصصة</option>
                      </select>
                    </div>

                    {/* Budget estimation */}
                    <div>
                      <label className="block text-xs font-bold text-teal-100 mb-1.5">
                        الميزانية التقريبية المتوقعة (اختياري)
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="مثال: 1500 (ج.م)"
                        className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-3 text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition shadow-inner font-semibold"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-xs font-bold text-teal-100 mb-1.5">
                      تفاصيل ومواصفات المطلوب <span className="text-[#3AF0E4]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="اذكر نوع مشروعك، الألوان المفضلة، النصوص، أو أي أمثلة تحبها لنفهم رغبتك بدقة..."
                      className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-3 text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition leading-relaxed resize-none font-medium shadow-inner"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-3d-primary w-full flex items-center justify-center gap-2 py-4 text-base cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? 'جاري تسجيل الطلب...' : 'إرسال الطلب وحجز موعد'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
