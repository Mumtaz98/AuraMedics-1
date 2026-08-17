import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Pill,
  Calendar,
  FileText,
  Activity,
  QrCode,
  MapPin,
  FolderHeart,
  Bell,
  User,
  Settings,
  Sparkles,
  UserCheck,
  Building2,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const { activeTab, setActiveTab, user, t } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; isEmergency?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'assistant', label: t.aiAssistant || 'Aura AI Assistant', icon: <Sparkles className="w-4 h-4 text-sky-500" />, badge: 'AI' },
    { id: 'medications', label: 'Medicine', icon: <Pill className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'reports', label: 'Medical Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'health_monitor', label: 'Health Monitor', icon: <Activity className="w-4 h-4" /> },
    { id: 'emergency_passport', label: 'Emergency Passport', icon: <QrCode className="w-4 h-4" />, isEmergency: true },
    { id: 'pharmacies', label: 'Nearby Pharmacy', icon: <MapPin className="w-4 h-4" /> },
    { id: 'health_records', label: 'Health Records', icon: <FolderHeart className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (user.role === 'doctor' || user.role === 'admin') {
    navItems.push({ id: 'doctor_view', label: 'Doctor View', icon: <UserCheck className="w-4 h-4" /> });
    navItems.push({ id: 'admin_view', label: 'Admin Dashboard', icon: <Building2 className="w-4 h-4" /> });
  }

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#141619] text-white p-4">
      {/* Brand Section */}
      <div className="mb-4 pb-3 border-b border-[#1e2229] flex items-center justify-between">
        <div>
          <div className="label-meta text-[10px] text-sky-400 tracking-widest font-mono">System v4.0</div>
          <h1 className="font-display font-bold text-xl text-sky-400 tracking-tight leading-none">
            AuraMed
          </h1>
          <span className="font-mono text-[9px] text-slate-400 tracking-wider block uppercase">Health Portfolio</span>
        </div>

        {/* Close button on mobile */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl bg-[#1e2229] text-slate-300 hover:text-white"
            title="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Chip Header */}
      <div className="mb-4 p-2.5 rounded-xl bg-[#0b0c0d] border border-[#1e2229] flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-lg object-cover border border-sky-400/50"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0b0c0d]"></span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-xs text-white truncate">{user.name}</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            ID: <strong className="text-sky-400">{user.patientId}</strong>
          </span>
        </div>
      </div>

      <div className="label-meta mb-2">Navigation</div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 min-h-[44px] ${
                isActive
                  ? item.isEmergency
                    ? 'bg-rose-600 text-white font-bold shadow-md'
                    : 'bg-[#1e2229] text-white border-l-4 border-sky-400 font-bold'
                  : item.isEmergency
                  ? 'text-rose-400 hover:bg-rose-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#1e2229]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={isActive ? (item.isEmergency ? 'text-white' : 'text-sky-400') : ''}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${isActive ? 'bg-sky-400 text-black' : 'bg-sky-950 text-sky-400 border border-sky-500/30'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Emergency Quick Action Button */}
      <div className="mt-auto pt-3 border-t border-[#1e2229]">
        <button
          onClick={() => handleNavClick('emergency_passport')}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 font-mono uppercase min-h-[44px]"
        >
          <QrCode className="w-4 h-4 animate-pulse" />
          <span>Emergency Passport</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 h-full w-64 hidden md:flex flex-col bg-[#141619] border-r border-[#1e2229] shadow-2xl z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-over Overlay */}
      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-[#141619] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
