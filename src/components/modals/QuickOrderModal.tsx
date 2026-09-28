import React, { useState, useEffect } from 'react';
import { ServiceItem, PricingPackage, ContactSettings } from '../../types';
import { X, Send, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { createClientQuickOrder } from '../../services/storage';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: ServiceItem | null;
  selectedPackage?: PricingPackage | null;
  services: ServiceItem[];
  packages: PricingPackage[];
  contact: ContactSettings;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  selectedService,
  selectedPackage,
  services,
  packages,
  contact,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [packageId, setPackageId] = useState('');
  const [details, setDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [orderSuccessNumber, setOrderSuccessNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedService) {
      setServiceCategory(selectedService.title);
      setDetails(`أرغب في طلب خدمة: ${selectedService.title}\n`);
    } else if (selectedPackage) {
      setServiceCategory(`باقة: ${selectedPackage.name}`);
      setPackageId(selectedPackage.id);
      setBudget(String(selectedPackage.price));
      setDetails(`أرغب في حجز: ${selectedPackage.name} بسعر ${selectedPackage.price} ج.م\n`);
    } else {
      setServiceCategory(services[0]?.title || 'الهوية البصرية الكاملة واللوجو');
    }
  }, [selectedService, selectedPackage, services]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !details.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = createClientQuickOrder({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        serviceCategory,
        packageId: packageId || undefined,
        title: `طلب: ${serviceCategory}`,
        details: details.trim(),
        budget: budget ? parseFloat(budget) : undefined,
      });

      setOrderSuccessNumber(order.orderNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setOrderSuccessNumber(null);
    setClientName('');
    setClientPhone('');
    setDetails('');
    setBudget('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083B3A]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#005550] border-2 border-[#1B8F86] rounded-[26px] p-6 sm:p-8 shadow-[10px_10px_0_#042221] overflow-hidden max-h-[90vh] overflow-y-auto card-gloss-top text-white">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="إغلاق نافذة الطلب"
          className="absolute top-5 left-5 text-teal-200 hover:text-white p-1 rounded-xl hover:bg-[#083B3A] transition cursor-pointer border border-[#1B8F86]/40"
        >
          <X className="w-6 h-6" />
        </button>

        {orderSuccessNumber ? (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#54DDDE]/20 text-[#3AF0E4] rounded-2xl flex items-center justify-center mx-auto border border-[#54DDDE]/40 shadow-[3px_3px_0_#042221]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">تم استلام طلبك بنجاح!</h3>
              <p className="text-sm text-teal-100 mt-1 font-semibold">
                رقم حجزك في النظام هو:{' '}
                <span className="font-mono font-black text-[#3AF0E4]">{orderSuccessNumber}</span>
              </p>
              <p className="text-xs text-teal-200/80 mt-2 max-w-md mx-auto">
                تم تسجيل التفاصيل في لوحة المهام. يمكنك إرسال ملخص الطلب فوراً إلى الواتساب لبدء التنفيذ بدون أي تأخير.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
                  `مرحباً، قمت بتقديم طلب تصميم جديد عبر الموقع برقم (${orderSuccessNumber}).\nالاسم: ${clientName}\nالخدمة: ${serviceCategory}\nالتفاصيل: ${details}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-primary flex items-center justify-center gap-2 py-3.5 px-6 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>إرسال التفاصيل مباشرة عبر واتساب</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="text-xs text-teal-200 hover:text-white py-2 cursor-pointer font-bold underline"
              >
                إغلاق النافذة والعودة للموقع
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[#3AF0E4] text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>طلب تصميم جديد مباشر</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
              أهلاً بك! دعنا نبدأ مشروعك
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/80 mb-6 font-medium">
              املأ النموذج أدناه لتسجيل طلبك والبدء في التواصل والتنفيذ.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-teal-100 mb-1">
                  الاسم الكريم أو اسم النشاط <span className="text-[#3AF0E4]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: م/ كريم عبد العزيز"
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-2.5 text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition font-semibold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-teal-100 mb-1">
                  رقم الهاتف أو الواتساب <span className="text-[#3AF0E4]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-2.5 text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition font-semibold"
                />
              </div>

              {/* Service or Package */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-teal-100 mb-1">الخدمة المطلوبة</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#54DDDE] cursor-pointer font-semibold"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    {packages.map((p) => (
                      <option key={p.id} value={`باقة: ${p.name}`}>
                        باقة: {p.name}
                      </option>
                    ))}
                    <option value="طلب مخصص آخر">طلب مخصص آخر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-100 mb-1">
                    الميزانية التقديرية (اختياري)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="ج.م"
                    className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-3 py-2.5 text-xs text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] font-semibold"
                  />
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-xs font-bold text-teal-100 mb-1">
                  تفاصيل ورؤيتك للتصميم <span className="text-[#3AF0E4]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="اكتب أفكارك، الألوان المرغوبة، المقاسات، أو الروابط المرجعية..."
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] resize-none leading-relaxed font-medium"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري التأكيد...' : 'إرسال الطلب وحجز الخدمة'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
