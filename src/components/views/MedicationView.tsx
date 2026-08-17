import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
  Utensils,
  Bell,
  Check,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MedicationView: React.FC = () => {
  const {
    medications,
    medicationLogs,
    takeMedication,
    snoozeMedication,
    skipMedication,
    addMedication,
    setMedications,
    t,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Daily');
  const [newMedTime, setNewMedTime] = useState('08:00');
  const [newMedTiming, setNewMedTiming] = useState<'before_food' | 'after_food' | 'with_water' | 'as_needed'>('after_food');
  const [newMedInstructions, setNewMedInstructions] = useState('');

  // Adherence chart data over past 7 days
  const adherenceData = [
    { day: 'Mon', percentage: 100 },
    { day: 'Tue', percentage: 100 },
    { day: 'Wed', percentage: 80 },
    { day: 'Thu', percentage: 100 },
    { day: 'Fri', percentage: 100 },
    { day: 'Sat', percentage: 100 },
    { day: 'Sun', percentage: 100 },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newMedDosage) return;

    addMedication({
      name: newMedName,
      dosage: newMedDosage,
      frequency: newMedFreq,
      times: [newMedTime],
      mealTiming: newMedTiming,
      instructions: newMedInstructions || 'Take as prescribed.',
      startDate: new Date().toISOString().split('T')[0],
    });

    setNewMedName('');
    setNewMedDosage('');
    setIsAddModalOpen(false);
  };

  const handleDeleteMed = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-secondary-container text-secondary">
              <Pill className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-on-surface">Medicine Management & Schedule</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Track daily dosages, meal timings, adherence stats, and set reminders.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-secondary text-on-secondary font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Grid: Daily Timeline (2 cols) & Adherence Chart (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Dosage Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span>Today's Dosage Schedule (Aug 10, 2026)</span>
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-xs font-bold">
                Adherence Rate: 94%
              </span>
            </div>

            <div className="space-y-4">
              {medicationLogs.map((log) => {
                const isTaken = log.status === 'taken';
                const isSnoozed = log.status === 'snoozed';
                return (
                  <div
                    key={log.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isTaken
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/60'
                        : isSnoozed
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300/60'
                        : 'bg-surface-container-low border-outline-variant/30 hover:border-secondary/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isTaken
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-secondary-container text-secondary'
                          }`}
                        >
                          <Pill className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base text-on-surface">{log.medicationName}</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-semibold text-xs">
                              {log.dosage}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-secondary text-[11px] font-medium flex items-center gap-1">
                              <Utensils className="w-3 h-3" /> After Meal
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                            <span className="flex items-center gap-1 font-semibold text-on-surface">
                              <Clock className="w-3.5 h-3.5 text-secondary" /> {log.scheduledTime}
                            </span>
                            {log.takenAt && (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Logged at {log.takenAt}
                              </span>
                            )}
                            {isSnoozed && (
                              <span className="text-amber-600 font-bold flex items-center gap-1">
                                <Bell className="w-3.5 h-3.5 animate-bounce" /> Snoozed (+15 mins)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!isTaken ? (
                          <>
                            <button
                              onClick={() => takeMedication(log.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-xs active:scale-95"
                            >
                              <Check className="w-4 h-4" /> Take Now
                            </button>
                            <button
                              onClick={() => snoozeMedication(log.id)}
                              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-medium text-xs transition-all"
                            >
                              Snooze
                            </button>
                            <button
                              onClick={() => skipMedication(log.id)}
                              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs transition-all"
                            >
                              Skip
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Dose Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Prescribed Medications List */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
            <h2 className="text-base font-bold text-on-surface mb-3">All Active Prescriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-on-surface">{med.name}</strong>
                      <span className="text-xs text-secondary font-bold">{med.dosage}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{med.instructions}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-on-surface-variant">
                      <span className="font-semibold text-on-surface">{med.frequency}</span>
                      <span>• Times: {med.times.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMed(med.id)}
                    className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-surface-container"
                    title="Remove Medication"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Adherence Analytics & AI Insights */}
        <div className="space-y-6">
          {/* Adherence Chart */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Weekly Adherence</span>
              </h2>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#0284C7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-on-surface-variant mt-2 text-center">
              Consistent daily adherence reduces long-term cardiovascular risks.
            </p>
          </div>

          {/* AI Pattern Observations Box */}
          <div className="bg-gradient-to-br from-secondary-container/30 via-surface to-surface p-6 rounded-3xl border border-secondary/20 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-secondary font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Aura Adherence Insights</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              You've maintained a <strong>94% medication compliance rate</strong> over the last 30 days! Morning doses are consistently logged on time.
            </p>
            <div className="p-3 rounded-2xl bg-surface border border-outline-variant/20 text-xs text-on-surface">
              💡 <strong>Tip:</strong> Taking Atorvastatin consistently in the evening optimizes natural cholesterol synthesis cycles.
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Pill className="w-5 h-5 text-secondary" />
                <span>Add Medication Reminder</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Metformin"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 500mg"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface">Frequency</label>
                  <select
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice a day">Twice a day</option>
                    <option value="Thrice a day">Thrice a day</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface">Meal Timing</label>
                  <select
                    value={newMedTiming}
                    onChange={(e) => setNewMedTiming(e.target.value as any)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 outline-none"
                  >
                    <option value="after_food">After Food</option>
                    <option value="before_food">Before Food</option>
                    <option value="with_water">With Water</option>
                    <option value="as_needed">As Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface">Special Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Take after breakfast with water"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest focus:ring-2 focus:ring-secondary/40 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
