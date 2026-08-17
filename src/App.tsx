import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/navigation/Header';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { DashboardView } from './components/views/DashboardView';
import { MedicationView } from './components/views/MedicationView';
import { AppointmentView } from './components/views/AppointmentView';
import { ReportAnalyzerView } from './components/views/ReportAnalyzerView';
import { HealthMonitorView } from './components/views/HealthMonitorView';
import { EmergencyPassportView } from './components/views/EmergencyPassportView';
import { NearbyPharmacyView } from './components/views/NearbyPharmacyView';
import { HealthRecordsView } from './components/views/HealthRecordsView';
import { NotificationsView } from './components/views/NotificationsView';
import { ProfileSettingsView } from './components/views/ProfileSettingsModal';
import { AdminDoctorDashboardView } from './components/views/AdminDoctorDashboardView';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AuraAssistantOverlay } from './components/assistant/AuraAssistantOverlay';

const MainContent: React.FC = () => {
  const { activeTab, theme } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'medications':
        return <MedicationView />;
      case 'appointments':
        return <AppointmentView />;
      case 'reports':
        return <ReportAnalyzerView />;
      case 'health_monitor':
        return <HealthMonitorView />;
      case 'emergency_passport':
        return <EmergencyPassportView />;
      case 'pharmacies':
        return <NearbyPharmacyView />;
      case 'health_records':
        return <HealthRecordsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileSettingsView isSettingsMode={false} />;
      case 'settings':
        return <ProfileSettingsView isSettingsMode={true} />;
      case 'doctor_view':
      case 'admin_view':
        return <AdminDoctorDashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-[#0F172A]'} font-sans antialiased selection:bg-sky-500/20 selection:text-sky-600`}>
      {/* Fixed Top Header */}
      <Header onToggleMobileNav={toggleMobileNav} />

      {/* Responsive Layout Container */}
      <div className="flex pt-16">
        {/* Responsive Sidebar (Desktop Fixed & Mobile Drawer) */}
        <Sidebar isOpenOnMobile={isMobileNavOpen} onCloseMobile={() => setIsMobileNavOpen(false)} />

        {/* Main View Container adapted for Mobile, Tablet, and Laptop Screens */}
        <main className="flex-1 md:pl-64 p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full transition-all min-h-[calc(100vh-4rem)] pb-28 md:pb-12">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav onToggleMobileNav={toggleMobileNav} />

      {/* Modals & Overlays */}
      <OnboardingModal />
      <AuraAssistantOverlay />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
