import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Pill, FileText, QrCode, Globe, ChevronRight, Check } from 'lucide-react';
import { LanguageCode } from '../../types';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setLanguage, language } = useApp();
  const [step, setStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const slides = [
    {
      title: 'Welcome to AuraMedical AI',
      subtitle: 'Your Intelligent Health Companion',
      description:
        'A comprehensive AI-powered healthcare platform that unifies medicine schedules, appointment management, medical report analysis, and emergency response.',
      icon: <Sparkles className="w-12 h-12 text-secondary animate-pulse" />,
    },
    {
      title: 'Smart Medication Reminders',
      subtitle: 'Never miss a dose',
      description:
        'Log morning, afternoon, and evening medications with meal-timing alerts, adherence tracking graphs, and snoozes.',
      icon: <Pill className="w-12 h-12 text-secondary" />,
    },
    {
      title: 'AI Medical Report Analyzer',
      subtitle: 'Understand complex lab tests instantly',
      description:
        'Drag and drop CBC, lipid panel, or blood glucose reports. Aura translates lab ranges into plain language and generates questions for your doctor.',
      icon: <FileText className="w-12 h-12 text-emerald-600" />,
    },
    {
      title: 'Emergency Passport & QR',
      subtitle: 'Paramedic access in critical moments',
      description:
        'Encrypted dynamic QR code carrying blood group, allergies, chronic conditions, and primary emergency contacts.',
      icon: <QrCode className="w-12 h-12 text-error" />,
    },
    {
      title: 'Select Preferred Language',
      subtitle: 'Multilingual AI Support',
      description: 'Choose your default language for voice assistant, reports, and UI screens.',
      icon: <Globe className="w-12 h-12 text-secondary" />,
      isLangStep: true,
    },
  ];

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

  const handleFinish = () => {
    localStorage.setItem('auramed_onboarding', 'true');
    setIsOnboardingOpen(false);
  };

  const current = slides[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl max-w-lg w-full p-8 border border-outline-variant/30 shadow-2xl space-y-6 animate-in zoom-in-95 text-center">
        {/* Slide Icon */}
        <div className="w-20 h-20 rounded-3xl bg-secondary-container/50 flex items-center justify-center mx-auto shadow-sm">
          {current.icon}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-on-surface">{current.title}</h2>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider block">{current.subtitle}</span>
          <p className="text-xs text-on-surface-variant leading-relaxed px-4">{current.description}</p>
        </div>

        {/* Language Selection Step */}
        {current.isLangStep && (
          <div className="grid grid-cols-3 gap-2 text-left pt-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  language === l.code
                    ? 'bg-secondary text-on-secondary border-secondary font-bold shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Slide Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-6 bg-secondary' : 'w-2 bg-surface-container-highest'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleFinish}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface"
          >
            Skip Onboarding
          </button>

          {step < slides.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
