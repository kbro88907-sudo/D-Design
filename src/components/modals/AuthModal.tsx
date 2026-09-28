import React, { useState } from 'react';
import { DesignerWorker } from '../../types';
import { AuthSession, setAuthSession } from '../../services/storage';
import { X, Lock, Shield, Phone, Mail, KeyRound, UserCheck, AlertCircle } from 'lucide-react';
import { LogoD } from '../common/LogoD';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  designers: DesignerWorker[];
  onLoginSuccess: (session: AuthSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  designers,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'admin' | 'worker'>('admin');
  
  // Admin credentials
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Worker credentials
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerPassword, setWorkerPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate admin credentials
    // Accepts default admin email or 'admin'
    const trimmedEmail = adminEmail.trim().toLowerCase();
    if (
      (trimmedEmail === 'admin@portfolio.com' || trimmedEmail === 'admin') &&
      adminPassword === 'admin123456'
    ) {
      const session: AuthSession = {
        role: 'admin',
        name: 'مدير الاستوديو (Admin)',
        email: 'admin@portfolio.com',
      };
      setAuthSession(session);
      onLoginSuccess(session);
      onClose();
    } else {
      setErrorMessage('بيانات دخول الأدمن غير صحيحة. يمكنك تجربة الزر المساعد أدناه.');
    }
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = workerPhone.trim();
    const cleanPassword = workerPassword.trim();

    const designer = designers.find(
      (d) => d.phone === cleanPhone && (d.password === cleanPassword || !d.password)
    );

    if (designer) {
      if (!designer.isActive) {
        setErrorMessage('هذا الحساب معطل حالياً من قِبل إدارة الاستوديو.');
        return;
      }

      const session: AuthSession = {
        role: 'designer',
        designerId: designer.id,
        name: designer.name,
        phone: designer.phone,
        email: designer.email,
      };
      setAuthSession(session);
      onLoginSuccess(session);
      onClose();
    } else {
      setErrorMessage('رقم الهاتف أو كلمة المرور غير مطابقة لأي مصمم مسجل.');
    }
  };

  const fillDemoAdmin = () => {
    setAdminEmail('admin@portfolio.com');
    setAdminPassword('admin123456');
    setErrorMessage(null);
  };

  const fillDemoWorker = () => {
    setWorkerPhone('01012345678');
    setWorkerPassword('worker123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#083B3A]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#005550] border-2 border-[#1B8F86] rounded-[26px] p-6 sm:p-8 shadow-[10px_10px_0_#042221] overflow-hidden card-gloss-top text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="إغلاق نافذة تسجيل الدخول"
          className="absolute top-5 left-5 text-teal-200 hover:text-white p-1 rounded-xl hover:bg-[#083B3A] transition cursor-pointer border border-[#1B8F86]/40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Monogram with 3D Logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <LogoD size={64} className="shadow-[4px_4px_0_#083B3A]" />
          </div>
          <h3 className="text-2xl font-black text-white">بوابة الدخول المحمية</h3>
          <p className="text-xs text-teal-100/80 font-medium">
            سجل الدخول للمتابعة إلى لوحة التحكم المخصصة لك
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#083B3A] rounded-2xl border border-[#1B8F86] mb-6">
          <button
            onClick={() => {
              setTab('admin');
              setErrorMessage(null);
            }}
            className={`py-2.5 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'admin'
                ? 'bg-[#54DDDE] text-[#083B3A] shadow-[2px_2px_0_#042221]'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>لوحة الأدمن</span>
          </button>

          <button
            onClick={() => {
              setTab('worker');
              setErrorMessage(null);
            }}
            className={`py-2.5 text-xs font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'worker'
                ? 'bg-[#54DDDE] text-[#083B3A] shadow-[2px_2px_0_#042221]'
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>لوحة المصمم</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Admin Form */}
        {tab === 'admin' ? (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-teal-100 mb-1">
                البريد الإلكتروني للأدمن
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl py-3 pr-10 pl-4 text-xs text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition font-semibold"
                />
                <Mail className="w-4 h-4 text-[#3AF0E4] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-100 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl py-3 pr-10 pl-4 text-xs text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition font-semibold"
                />
                <KeyRound className="w-4 h-4 text-[#3AF0E4] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-3d-primary w-full py-3.5 text-xs sm:text-sm cursor-pointer mt-2"
            >
              تسجيل الدخول كأدمن
            </button>

            {/* Quick Demo Helper */}
            <div className="pt-2 text-center border-t border-[#1B8F86]/40">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-[11px] text-[#3AF0E4] hover:underline cursor-pointer font-bold"
              >
                ⚡ تعبئة بيانات حساب الأدمن التجريبي (admin@portfolio.com)
              </button>
            </div>
          </form>
        ) : (
          /* Worker Form */
          <form onSubmit={handleWorkerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-teal-100 mb-1">
                رقم هاتف المصمم
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl py-3 pr-10 pl-4 text-xs text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition font-semibold"
                />
                <Phone className="w-4 h-4 text-[#3AF0E4] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-100 mb-1">
                كلمة المرور المسجلة
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={workerPassword}
                  onChange={(e) => setWorkerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#083B3A] border-2 border-[#1B8F86] rounded-2xl py-3 pr-10 pl-4 text-xs text-white placeholder-teal-200/40 focus:outline-none focus:border-[#54DDDE] transition font-semibold"
                />
                <KeyRound className="w-4 h-4 text-[#3AF0E4] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-3d-primary w-full py-3.5 text-xs sm:text-sm cursor-pointer mt-2"
            >
              دخول المصمم
            </button>

            {/* Quick Demo Helper */}
            <div className="pt-2 text-center border-t border-[#1B8F86]/40">
              <button
                type="button"
                onClick={fillDemoWorker}
                className="text-[11px] text-[#3AF0E4] hover:underline cursor-pointer font-bold"
              >
                ⚡ تعبئة بيانات المصمم التجريبي (أحمد كمال - 01012345678)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

