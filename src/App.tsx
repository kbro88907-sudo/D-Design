import React, { useState, useEffect } from 'react';
import {
  AppDatabaseState,
  ServiceItem,
  PricingPackage,
  PortfolioProject,
} from './types';
import {
  getDatabaseState,
  subscribeToDatabase,
  getAuthSession,
  setAuthSession,
  clearAuthSession,
  AuthSession,
} from './services/storage';

// Public Components
import { AnnouncementBar } from './components/public/AnnouncementBar';
import { Header } from './components/public/Header';
import { HeroSection } from './components/public/HeroSection';
import { ServicesSection } from './components/public/ServicesSection';
import { WorkflowSection } from './components/public/WorkflowSection';
import { PortfolioSection } from './components/public/PortfolioSection';
import { PackagesSection } from './components/public/PackagesSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { PoliciesSection } from './components/public/PoliciesSection';
import { PromptsSection } from './components/public/PromptsSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';

// Modals
import { QuickOrderModal } from './components/modals/QuickOrderModal';
import { AuthModal } from './components/modals/AuthModal';

// Dashboards
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WorkerDashboard } from './components/worker/WorkerDashboard';

export default function App() {
  const [dbState, setDbState] = useState<AppDatabaseState>(getDatabaseState);
  const [authSession, setAuthSessionState] = useState<AuthSession>(getAuthSession);

  // View state: 'public' | 'admin' | 'worker'
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'worker'>('public');

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<ServiceItem | null>(null);
  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<PricingPackage | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Subscribe to reactive database changes (localStorage updates, orders, new tasks)
  useEffect(() => {
    const unsubscribe = subscribeToDatabase((newState) => {
      setDbState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Listen to hash for direct portal navigation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin-portal') {
        const session = getAuthSession();
        if (session.role === 'admin') setCurrentView('admin');
        else if (session.role === 'designer') setCurrentView('worker');
        else setIsAuthModalOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handlers for orders
  const handleOpenOrderModal = () => {
    setSelectedServiceForOrder(null);
    setSelectedPackageForOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleSelectServiceForOrder = (service: ServiceItem) => {
    setSelectedServiceForOrder(service);
    setSelectedPackageForOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleSelectPackageForOrder = (pkg: PricingPackage) => {
    setSelectedPackageForOrder(pkg);
    setSelectedServiceForOrder(null);
    setIsOrderModalOpen(true);
  };

  const handleOrderSimilarProject = (project: PortfolioProject) => {
    const matchedService = dbState.services.find((s) => s.category === project.serviceCategory);
    if (matchedService) {
      handleSelectServiceForOrder(matchedService);
    } else {
      handleOpenOrderModal();
    }
  };

  // Auth & View Handlers
  const handleLoginSuccess = (session: AuthSession) => {
    setAuthSessionState(session);
    if (session.role === 'admin') {
      setCurrentView('admin');
    } else if (session.role === 'designer') {
      setCurrentView('worker');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthSessionState({ role: 'guest' });
    setCurrentView('public');
    window.location.hash = '';
  };

  const handleOpenDashboard = () => {
    if (authSession.role === 'admin') {
      setCurrentView('admin');
    } else if (authSession.role === 'designer') {
      setCurrentView('worker');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // ---------------- VIEW ROUTING ----------------

  // 1. Admin Dashboard View
  if (currentView === 'admin' && authSession.role === 'admin') {
    return (
      <AdminDashboard
        dbState={dbState}
        onLogout={handleLogout}
        onReturnToHome={() => setCurrentView('public')}
      />
    );
  }

  // 2. Worker/Designer Dashboard View
  if (currentView === 'worker' && authSession.role === 'designer') {
    return (
      <WorkerDashboard
        designerId={authSession.designerId || ''}
        designerName={authSession.name || 'المصمم'}
        designerPhone={authSession.phone}
        tasks={dbState.tasks}
        onLogout={handleLogout}
        onReturnToHome={() => setCurrentView('public')}
      />
    );
  }

  // 3. Public Client Website
  return (
    <div className="min-h-screen bg-[#083B3A] text-white flex flex-col font-['Cairo',sans-serif] selection:bg-[#54DDDE] selection:text-[#083B3A]">
      {/* 1. Announcements & Offers Top Bar with Live Countdown */}
      <AnnouncementBar
        offers={dbState.offers}
        announcements={dbState.announcements}
        onSelectOfferAction={() => {
          const el = document.getElementById('packages');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Header */}
      <Header
        onOpenOrderModal={handleOpenOrderModal}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        authSession={authSession}
        onOpenDashboard={handleOpenDashboard}
        contactPhone={dbState.contact.primaryPhone}
        whatsappNumber={dbState.contact.whatsappNumber}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection
          onScrollToPortfolio={() => {
            const el = document.getElementById('portfolio');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          whatsappNumber={dbState.contact.whatsappNumber}
          whatsappMessage={dbState.contact.whatsappMessage}
        />

        {/* 4. Services Section (11 core services) */}
        <ServicesSection
          services={dbState.services}
          onSelectServiceForOrder={handleSelectServiceForOrder}
        />

        {/* 4.5 Workflow Section (طريقة العمل 3 خطوات) */}
        <WorkflowSection
          onStartOrder={handleOpenOrderModal}
          whatsappNumber={dbState.contact.whatsappNumber}
        />

        {/* 5. Portfolio Section (with Category filter & Lightbox) */}
        <PortfolioSection
          projects={dbState.portfolio}
          onOrderSimilarProject={handleOrderSimilarProject}
        />

        {/* 6. Pricing Packages Section (Dynamic database state with discounts) */}
        <PackagesSection
          packages={dbState.packages}
          offers={dbState.offers}
          onSelectPackageForOrder={handleSelectPackageForOrder}
        />

        {/* 7. Testimonials Slider */}
        <TestimonialsSection testimonials={dbState.testimonials} />

        {/* 8. Usage Policies Accordion */}
        <PoliciesSection policies={dbState.policies} />

        {/* 9. Prompts Library Showcase */}
        <PromptsSection prompts={dbState.prompts} />

        {/* 10. Contact Us & Quick Order Form */}
        <ContactSection
          contact={dbState.contact}
          services={dbState.services}
        />
      </main>

      {/* 11. Footer */}
      <Footer
        contact={dbState.contact}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        isLoggedIn={authSession.role !== 'guest'}
      />

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedService={selectedServiceForOrder}
        selectedPackage={selectedPackageForOrder}
        services={dbState.services}
        packages={dbState.packages}
        contact={dbState.contact}
      />

      {/* Admin / Worker Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        designers={dbState.designers}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
