import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderHeart, Search, FileText, Calendar, Pill, Activity, ShieldAlert, ChevronRight } from 'lucide-react';

export const HealthRecordsView: React.FC = () => {
  const { reports, appointments, vitals, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState('all');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-secondary-container text-secondary">
              <FolderHeart className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-on-surface">Centralized Health Records</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Chronological repository of lab tests, prescriptions, doctor summaries, and telemetry history.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'reports', 'appointments', 'vitals'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-4 py-2 rounded-2xl font-semibold text-xs capitalize transition-all ${
              filterType === f
                ? 'bg-secondary text-on-secondary shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-on-surface">Timeline History (2026)</h2>

        <div className="relative border-l-2 border-outline-variant/30 ml-4 pl-6 space-y-6">
          {/* Reports Items */}
          {(filterType === 'all' || filterType === 'reports') &&
            reports.map((rep) => (
              <div key={rep.id} className="relative group">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface" />
                <div
                  onClick={() => setActiveTab('reports')}
                  className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div>
                      <strong className="text-sm text-on-surface block">{rep.title}</strong>
                      <span className="text-xs text-on-surface-variant">{rep.date} • {rep.summary}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary" />
                </div>
              </div>
            ))}

          {/* Appointment Items */}
          {(filterType === 'all' || filterType === 'appointments') &&
            appointments.map((apt) => (
              <div key={apt.id} className="relative group">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-surface" />
                <div
                  onClick={() => setActiveTab('appointments')}
                  className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-purple-400 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <strong className="text-sm text-on-surface block">Consultation: {apt.doctorName}</strong>
                      <span className="text-xs text-on-surface-variant">{apt.date} • {apt.hospital}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-purple-600" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
