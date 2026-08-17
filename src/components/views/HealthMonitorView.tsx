import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Heart,
  Droplets,
  Zap,
  Moon,
  Plus,
  X,
  TrendingUp,
  Sparkles,
  Calendar,
  Thermometer,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const HealthMonitorView: React.FC = () => {
  const { vitals, addVitalEntry } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [hr, setHr] = useState(72);
  const [bpSys, setBpSys] = useState(118);
  const [bpDia, setBpDia] = useState(76);
  const [spo2Val, setSpo2Val] = useState(98);
  const [tempVal, setTempVal] = useState(98.6);
  const [glucoseVal, setGlucoseVal] = useState(92);
  const [weightVal, setWeightVal] = useState(70.5);

  const chartData = [...vitals].reverse();

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalEntry({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heartRate: Number(hr),
      bloodPressureSystolic: Number(bpSys),
      bloodPressureDiastolic: Number(bpDia),
      spo2: Number(spo2Val),
      temperature: Number(tempVal),
      glucose: Number(glucoseVal),
      weight: Number(weightVal),
      sleepHours: 7.5,
    });
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-on-surface">Health Monitor & Vitals Analytics</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Continuous telemetry trend analysis for blood pressure, pulse, glycemic readings, and SpO2.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-secondary text-on-secondary font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Vitals</span>
        </button>
      </div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Pressure Trend Line */}
        <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Blood Pressure Trends (Systolic / Diastolic)</span>
            </h2>
            <span className="text-xs font-bold text-emerald-600">118/76 mmHg Avg</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[60, 140]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bloodPressureSystolic" stroke="#2563eb" name="Systolic" strokeWidth={2.5} />
                <Line type="monotone" dataKey="bloodPressureDiastolic" stroke="#38bdf8" name="Diastolic" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heart Rate Area Chart */}
        <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Heart Rate Baseline (bpm)</span>
            </h2>
            <span className="text-xs font-bold text-emerald-600">72 bpm Avg</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fill="#fca5a5" fillOpacity={0.3} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vitals Log Table */}
      <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-on-surface">Recorded Telemetry Logs</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-on-surface">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Heart Rate</th>
                <th className="py-2.5 px-3">Blood Pressure</th>
                <th className="py-2.5 px-3">SpO2</th>
                <th className="py-2.5 px-3">Glucose</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {vitals.map((v) => (
                <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-semibold">{v.date} ({v.time})</td>
                  <td className="py-3 px-3">{v.heartRate} bpm</td>
                  <td className="py-3 px-3 font-bold text-secondary">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic} mmHg</td>
                  <td className="py-3 px-3">{v.spo2}%</td>
                  <td className="py-3 px-3">{v.glucose} mg/dL</td>
                  <td className="py-3 px-3">{v.weight} kg</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-[10px]">
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Vital Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                <span>Log Vitals & Telemetry</span>
              </h3>
              <button onClick={() => setIsLogModalOpen(false)} className="p-1 rounded-full hover:bg-surface-container">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={spo2Val}
                    onChange={(e) => setSpo2Val(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface">BP Systolic (mmHg)</label>
                  <input
                    type="number"
                    value={bpSys}
                    onChange={(e) => setBpSys(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface">BP Diastolic (mmHg)</label>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={(e) => setBpDia(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={glucoseVal}
                    onChange={(e) => setGlucoseVal(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightVal}
                    onChange={(e) => setWeightVal(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl border border-outline-variant/40 text-sm bg-surface-container-lowest outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
