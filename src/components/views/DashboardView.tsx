import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Pill,
  Calendar,
  FileText,
  Activity,
  QrCode,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Heart,
  Droplets,
  Zap,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    medicationLogs,
    appointments,
    reports,
    vitals,
    setActiveTab,
    takeMedication,
    setIsAuraOpen,
    setSelectedReport,
    t,
  } = useApp();

  const latestVital = vitals[0] || {
    heartRate: 72,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    spo2: 98,
    glucose: 92,
  };

  const todayLogs = medicationLogs.filter((log) => log.date === '2026-08-10' || log.status === 'pending');
  const upcomingApts = appointments.filter((a) => a.status === 'upcoming').slice(0, 2);

  // Health Score Calculation
  const healthScore = 87;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Welcome Banner with Solid Palette and Health Score Badge */}
      <div className="relative rounded-3xl bg-surface border border-outline-variant/40 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-300 dark:border-sky-800">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
              <span>Aura AI Health Monitor Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
              {t.goodMorning}, <span className="text-sky-600 dark:text-sky-400">{user.name}</span>
            </h1>
            <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
              Your vital signs are stable, and cholesterol indicators show positive response to therapy. Patient ID: <strong className="font-mono text-on-surface">{user.patientId}</strong>.
            </p>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('reports')}
                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 text-on-surface font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs border border-outline-variant/40"
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload Report</span>
              </button>
              <button
                onClick={() => setActiveTab('medications')}
                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 text-on-surface font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs border border-outline-variant/40"
              >
                <Pill className="w-3.5 h-3.5 text-purple-600" />
                <span>Log Medicine</span>
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 text-on-surface font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs border border-outline-variant/40"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Book Doctor</span>
              </button>
              <button
                onClick={() => setActiveTab('emergency_passport')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Emergency QR</span>
              </button>
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="shrink-0 bg-surface-container p-5 rounded-2xl border border-outline-variant/50 flex items-center gap-5 shadow-sm">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                  strokeDasharray={`${healthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-on-surface leading-none">{healthScore}</span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-extrabold">Optimal</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <span className="text-on-surface-variant font-bold">Aura Health Index</span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Good Metabolic Balance</span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-medium">Last updated 2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section 1: Today's Medication & Vital Signs Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Medications (2 cols) */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">{t.todayMedications}</h2>
                  <p className="text-xs text-on-surface-variant">3 doses scheduled for today</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('medications')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>View Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    log.status === 'taken'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      : 'bg-surface-container border-outline-variant/40 hover:border-sky-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        log.status === 'taken' ? 'bg-emerald-600 text-white' : 'bg-surface-container-high text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {log.status === 'taken' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">{log.medicationName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold">
                          {log.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-medium">
                        <Clock className="w-3 h-3 text-sky-600" />
                        <span>Scheduled: {log.scheduledTime}</span>
                        {log.takenAt && <span className="text-emerald-600 font-bold">• Taken at {log.takenAt}</span>}
                      </p>
                    </div>
                  </div>

                  {log.status !== 'taken' ? (
                    <button
                      onClick={() => takeMedication(log.id)}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs active:scale-95 transition-all shadow-xs"
                    >
                      {t.take} Now
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Taken
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vital Signs Overview Card */}
        <div className="bg-surface p-6 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Recent Vitals</h2>
                  <p className="text-xs text-on-surface-variant">Live telemetry sync</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('health_monitor')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Analytics
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Heart Rate
                </span>
                <span className="text-lg font-extrabold text-on-surface mt-1">{latestVital.heartRate} <span className="text-xs font-normal text-on-surface-variant">bpm</span></span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Normal Rhythm</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sky-500" /> Blood Pressure
                </span>
                <span className="text-lg font-extrabold text-on-surface mt-1">{latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}</span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Optimal Range</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-500" /> SpO2 Oxygen
                </span>
                <span className="text-lg font-extrabold text-on-surface mt-1">{latestVital.spo2}%</span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Excellent</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col">
                <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-amber-500" /> Glucose
                </span>
                <span className="text-lg font-extrabold text-on-surface mt-1">{latestVital.glucose} <span className="text-xs font-normal text-on-surface-variant">mg/dL</span></span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5">Fasting Normal</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('health_monitor')}
            className="w-full mt-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1 transition-all border border-outline-variant/40"
          >
            <span>Log New Vitals</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Section 2: AI Insights & Upcoming Appointments & Emergency QR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Health Assistant Box (Aura) */}
        <div className="bg-[#0F172A] text-white p-6 rounded-3xl border border-[#1E293B] shadow-md flex flex-col justify-between h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse shadow-[0_0_8px_#38BDF8]"></div>
              <span className="text-sm font-bold text-slate-200">Aura AI Assistant</span>
            </div>
            <button
              onClick={() => setIsAuraOpen(true)}
              className="text-[11px] font-bold text-sky-400 hover:underline"
            >
              Full Screen
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-1 custom-scrollbar">
            <div className="text-xs bg-[#1E293B] p-3.5 rounded-2xl rounded-tl-none border border-[#334155] text-slate-200 leading-relaxed font-medium">
              Good morning {user.name}. I've analyzed your lipid profile. Your HDL is looking good, but I noticed a slight increase in LDL (160 mg/dL).
            </div>
            <div className="text-xs bg-sky-600 p-3 rounded-2xl rounded-tr-none text-white self-end text-right ml-6 font-bold">
              Should I be worried about my LDL levels?
            </div>
            <div className="text-xs bg-[#1E293B] p-3.5 rounded-2xl rounded-tl-none border border-[#334155] text-slate-200 leading-relaxed font-medium">
              It's only a minor increase. I recommend maintaining your Atorvastatin 20mg regimen and scheduling a re-test in 2 weeks.
            </div>
          </div>

          <div
            onClick={() => setIsAuraOpen(true)}
            className="bg-[#1E293B] p-2.5 rounded-2xl flex items-center border border-[#334155] cursor-pointer group hover:border-sky-500 transition-all"
          >
            <input
              type="text"
              readOnly
              placeholder="Ask Aura..."
              className="bg-transparent border-none flex-1 text-xs text-white placeholder-slate-400 cursor-pointer focus:outline-none px-2"
            />
            <div className="bg-sky-600 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-surface p-6 rounded-3xl border border-outline-variant/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Doctor Visits</h2>
                  <p className="text-xs text-on-surface-variant">2 upcoming appointments</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {upcomingApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">{apt.doctorName}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                      {apt.date}
                    </span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">{apt.type} • {apt.hospital}</span>
                  <span className="text-[11px] text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {apt.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('appointments')}
            className="w-full mt-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1 transition-all border border-outline-variant/40"
          >
            <span>Book New Appointment</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Emergency Passport Card Shortcut */}
        <div className="bg-surface p-6 rounded-3xl border-2 border-rose-500/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">Emergency Passport</h2>
                  <p className="text-xs text-on-surface-variant">Paramedic Access Ready</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-1.5">
                <span className="text-on-surface-variant font-bold">Blood Group:</span>
                <strong className="text-rose-600 font-extrabold text-sm">{user.bloodGroup}</strong>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-1.5">
                <span className="text-on-surface-variant font-bold">Critical Allergies:</span>
                <span className="text-on-surface font-bold">{user.allergies.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-bold">Token Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Verified Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('emergency_passport')}
            className="w-full mt-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>Show Emergency QR Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
