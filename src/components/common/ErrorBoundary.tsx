import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#083B3A] text-white flex items-center justify-center p-6 text-center font-['Cairo',sans-serif]">
          <div className="max-w-md w-full bg-[#005550] border-2 border-[#1B8F86] rounded-3xl p-8 shadow-[8px_8px_0_#042221]">
            <div className="w-16 h-16 rounded-2xl bg-[#083B3A] border border-[#1B8F86] flex items-center justify-center mx-auto mb-4 text-[#3AF0E4]">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black mb-2 text-white">حدث خطأ غير متوقع</h2>
            <p className="text-xs text-teal-100/80 mb-6 leading-relaxed">
              يرجى إعادة تحميل الصفحة للمتابعة.
            </p>
            <button
              onClick={this.handleReload}
              className="btn-3d-primary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة تحميل الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
