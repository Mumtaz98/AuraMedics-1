import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Sparkles, Globe, Moon, Sun, ShieldAlert, Menu } from 'lucide-react';
import { LanguageCode } from '../../types';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const {
    user,
    setActiveTab,
    notifications,
    language,
    setLanguage,
    theme,
    setTheme,
    setIsAuraOpen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#141619] shadow-2xl border-b border-[#1e2229] transition-all md:pl-64 h-16 flex items-center justify-between px-3 sm:px-6 md:px-8">
      {/* Brand / Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-xl bg-[#1e2229] text-slate-200 hover:text-white transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          {/* Brand Logo graphic */}
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-extrabold shadow-md group-hover:scale-105 transition-transform shrink-0">
            <svg
              className="w-5 h-5 text-white stroke-[2.5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-white tracking-tight text-sm sm:text-base leading-none">
              AuraMed
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider">
              SYS_ACTIVE • v4.0
            </span>
          </div>
        </div>
      </div>

      {/* Actions: Aura Voice Assistant trigger, Language Selector, System Time, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Aura AI Mic/Chat Trigger */}
        <button
          onClick={() => setIsAuraOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-400 border border-sky-500/30 font-mono font-bold text-xs transition-all active:scale-95 shadow-xs shrink-0"
          title="Open Aura AI Voice & Chat Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="hidden sm:inline">AURA AI</span>
        </button>

        {/* System Time Badge */}
        <div className="hidden lg:flex items-center px-2.5 py-1 rounded-lg bg-[#0b0c0d] border border-[#1e2229] font-mono text-[10px] text-slate-400 font-bold tracking-wider">
          <span className="text-sky-400 mr-1.5">•</span> SYS_TIME: 14:02
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative group">
          <button
            className="p-2 rounded-xl hover:bg-[#1e2229] text-slate-300 transition-colors flex items-center gap-1 text-xs font-mono font-semibold"
            title="Switch Language"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="uppercase font-bold hidden md:inline">{language}</span>
          </button>

          <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-48 bg-[#141619] rounded-xl shadow-2xl border border-[#1e2229] py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-[#1e2229] mb-1">
              Select Language / भाषा चुनें
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#1e2229] transition-colors flex items-center justify-between font-mono ${
                  language === lang.code ? 'font-bold text-sky-400 bg-sky-950/50' : 'text-slate-300'
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-xl hover:bg-[#1e2229] text-slate-300 transition-colors"
          title="Toggle Dark/Light Theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Emergency Passport Quick Button */}
        <button
          onClick={() => setActiveTab('emergency_passport')}
          className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-800 transition-colors relative shadow-xs"
          title="Emergency Passport QR"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="p-2 rounded-xl hover:bg-[#1e2229] text-slate-300 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#141619] animate-ping" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#141619]" />
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-xl overflow-hidden border border-sky-400/50 hover:ring-2 hover:ring-sky-400 transition-all shrink-0 ml-1 shadow-xs"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
