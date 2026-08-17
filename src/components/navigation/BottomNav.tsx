import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { LayoutDashboard, Sparkles, FileText, Pill, Menu } from 'lucide-react';

interface BottomNavProps {
  onToggleMobileNav?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onToggleMobileNav }) => {
  const { activeTab, setActiveTab, setIsAuraOpen } = useApp();

  const mobileTabs: { id: ActiveTab | 'menu'; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'assistant', label: 'Assistant', icon: <Sparkles className="w-5 h-5 text-sky-400" /> },
    { id: 'medications', label: 'Medicine', icon: <Pill className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'menu', label: 'Menu', icon: <Menu className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Floating Aura AI Assistant Trigger Button (Mobile & Desktop) */}
      <button
        onClick={() => setIsAuraOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-sky-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border border-sky-400/30 group"
        title="Open Aura AI Voice & Chat Assistant"
      >
        <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#141619] border-t border-[#1e2229] shadow-2xl z-40 px-2 py-1.5 flex justify-around items-center h-[72px] pb-safe">
        {mobileTabs.map((tab) => {
          const isActive = tab.id !== 'menu' && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'assistant') {
                  setIsAuraOpen(true);
                } else if (tab.id === 'menu') {
                  if (onToggleMobileNav) onToggleMobileNav();
                } else {
                  setActiveTab(tab.id as ActiveTab);
                }
              }}
              className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-all font-mono min-w-[56px] ${
                isActive
                  ? 'bg-[#1e2229] text-sky-400 font-bold border-b-2 border-sky-400'
                  : 'text-slate-400 hover:text-white active:scale-95'
              }`}
            >
              <div className="mb-0.5">{tab.icon}</div>
              <span className="text-[10px] leading-none font-bold uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
