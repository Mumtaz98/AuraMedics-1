import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Settings, Globe, Moon, Sun, ShieldAlert, Key, Heart, Phone, Mail, Award, Lock } from 'lucide-react';
import { UserRole, LanguageCode } from '../../types';

export const ProfileSettingsView: React.FC<{ isSettingsMode?: boolean }> = ({ isSettingsMode }) => {
  const { user, setUser, language, setLanguage, theme, setTheme, regenerateEmergencyToken } = useApp();

  const handleRoleChange = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
  };

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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-secondary-container text-secondary">
              {isSettingsMode ? <Settings className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <h1 className="text-xl font-bold text-on-surface">
              {isSettingsMode ? 'Application Settings' : 'User Profile & Identity'}
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage your personal clinical profile, emergency contacts, language preferences, and role credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Identity Card */}
        <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4 text-center">
          <div className="relative inline-block mx-auto">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-secondary/30 mx-auto"
            />
            <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
              Active
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-on-surface">{user.name}</h2>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">Patient ID: <strong className="text-secondary">{user.patientId}</strong></p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-bold capitalize">
              Role: {user.role}
            </span>
          </div>

          <div className="pt-3 border-t border-outline-variant/20 space-y-2 text-xs text-left">
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-on-surface-variant">Email Address:</span>
              <span className="font-semibold text-on-surface">{user.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline-variant/10">
              <span className="text-on-surface-variant">Blood Group:</span>
              <strong className="text-error font-extrabold">{user.bloodGroup}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-on-surface-variant">Emergency Token:</span>
              <span className="font-mono text-[11px] text-secondary font-bold">{user.emergencyToken}</span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Settings & Role Switcher */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Switcher (For Demo & Clinical Personas) */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Award className="w-4 h-4 text-secondary" />
              <span>Clinical Role Persona Switcher</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              Switch role context to test healthcare responder or doctor access views.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {(['patient', 'doctor', 'hospital_staff', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`p-3 rounded-2xl border font-bold text-xs capitalize transition-all ${
                    user.role === r
                      ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences: Language & Theme */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Globe className="w-4 h-4 text-secondary" />
              <span>Language & Appearance Preferences</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Display Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Color Theme</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'light'
                        ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      theme === 'dark'
                        ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Emergency Token Reset */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Lock className="w-4 h-4 text-error" />
              <span>Security & Emergency Passport Token Reset</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              If you lose your printed QR code, regenerate your emergency security token immediately.
            </p>

            <button
              onClick={regenerateEmergencyToken}
              className="px-4 py-2.5 rounded-xl bg-error text-on-error font-semibold text-xs hover:brightness-110 transition-all shadow-xs"
            >
              Regenerate Emergency Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
