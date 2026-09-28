import React, { useState } from 'react';
import { DesignerWorker } from '../../types';
import { AuthSession, setAuthSession } from '../../services/storage';
import { auth } from '../../services/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const session: AuthSession = {
        role: 'admin',
        name: user.displayName || 'مدير الاستوديو (Admin)',
        email: user.email || 'admin@portfolio.com',
      };
      setAuthSession(session);
      onLoginSuccess(session);
      onClose();
    } catch (err) {
      console.warn('Google sign in notice:', err);
      setErrorMessage('تعذر إكمال تسجيل الدخول عبر Google. يمكنك استخدام بيانات الأدمن البديلة.');
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
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-[3px_3px_0_#042221]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>تسجيل الدخول السريع بحساب Google</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-teal-200/50 my-1">
              <div className="flex-1 h-px bg-[#1B8F86]/40" />
              <span>أو بالبريد وكلمة المرور</span>
              <div className="flex-1 h-px bg-[#1B8F86]/40" />
            </div>

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
          </div>
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

