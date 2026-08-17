import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Building2, Users, FileText, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';

export const AdminDoctorDashboardView: React.FC = () => {
  const { user, reports, medicationLogs, vitals } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600">
              {user.role === 'admin' ? <Building2 className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <h1 className="text-xl font-bold text-on-surface">
              {user.role === 'admin' ? 'Hospital Staff & Admin Operations' : 'Doctor Clinical Portal'}
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Authorized portal for patient panel monitoring, lab report verification, and clinical decision support.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 text-xs font-bold uppercase tracking-wider self-start sm:self-center">
          Role: {user.role}
        </span>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-surface border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-secondary-container text-secondary font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-on-surface">1,420</span>
            <span className="text-xs text-on-surface-variant block font-medium">Active Patients Enrolled</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-on-surface">94%</span>
            <span className="text-xs text-on-surface-variant block font-medium">Panel Medication Compliance</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-on-surface">{reports.length}</span>
            <span className="text-xs text-on-surface-variant block font-medium">Reports Pending Verification</span>
          </div>
        </div>
      </div>

      {/* Patient Clinical Summary Table */}
      <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-on-surface">Assigned Patient Queue (Clinical ID AH7829)</h2>

        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.avatarUrl} alt="Patient" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <strong className="text-sm text-on-surface block">{user.name}</strong>
                <span className="text-xs text-on-surface-variant">Patient ID: AH7829 • Blood Group: O+</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-xs">
              Stable Vitals
            </span>
          </div>

          <p className="text-xs text-on-surface-variant">
            <strong>Clinical Note:</strong> Patient taking Atorvastatin 20mg and Lisinopril 10mg. Recent Lipid Profile shows LDL elevated at 160 mg/dL.
          </p>
        </div>
      </div>
    </div>
  );
};
