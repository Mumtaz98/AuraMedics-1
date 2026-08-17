import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Medication,
  MedicationLog,
  Appointment,
  MedicalReport,
  VitalEntry,
  Pharmacy,
  NotificationItem,
  ChatMessage,
  LanguageCode,
} from '../types';
import {
  mockUserProfile,
  initialMedications,
  initialMedicationLogs,
  initialAppointments,
  initialReports,
  initialVitals,
  initialPharmacies,
  initialNotifications,
  initialEmergencyAccessLogs,
} from '../data/mockData';
import { translations } from '../i18n/translations';

export type ActiveTab =
  | 'dashboard'
  | 'assistant'
  | 'medications'
  | 'appointments'
  | 'reports'
  | 'health_monitor'
  | 'emergency_passport'
  | 'pharmacies'
  | 'health_records'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'doctor_view'
  | 'admin_view';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  medicationLogs: MedicationLog[];
  setMedicationLogs: React.Dispatch<React.SetStateAction<MedicationLog[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  reports: MedicalReport[];
  setReports: React.Dispatch<React.SetStateAction<MedicalReport[]>>;
  vitals: VitalEntry[];
  setVitals: React.Dispatch<React.SetStateAction<VitalEntry[]>>;
  pharmacies: Pharmacy[];
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isAuraOpen: boolean;
  setIsAuraOpen: (open: boolean) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  t: typeof translations['en'];
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  selectedReport: MedicalReport | null;
  setSelectedReport: (report: MedicalReport | null) => void;
  emergencyAccessLogs: typeof initialEmergencyAccessLogs;
  // Action Handlers
  takeMedication: (logId: string) => void;
  snoozeMedication: (logId: string) => void;
  skipMedication: (logId: string) => void;
  addMedication: (med: Omit<Medication, 'id'>) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  addVitalEntry: (vital: Omit<VitalEntry, 'id'>) => void;
  addReport: (report: Omit<MedicalReport, 'id'>) => void;
  regenerateEmergencyToken: () => void;
  executeAuraTool: (toolName: string, params?: Record<string, any>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(mockUserProfile);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(initialMedicationLogs);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [reports, setReports] = useState<MedicalReport[]>(initialReports);
  const [vitals, setVitals] = useState<VitalEntry[]>(initialVitals);
  const [pharmacies] = useState<Pharmacy[]>(initialPharmacies);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'aura',
      text: "Hello! I'm Aura, your intelligent health companion. How can I help with your health today?",
      timestamp: 'Just now',
    },
  ]);
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [emergencyAccessLogs, setEmergencyAccessLogs] = useState(initialEmergencyAccessLogs);

  const t = translations[language] || translations.en;

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setUser((prev) => ({ ...prev, language: lang }));
  };

  useEffect(() => {
    // Check local storage for first time user or dark theme
    const hasSeenOnboarding = localStorage.getItem('auramed_onboarding');
    if (!hasSeenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const takeMedication = (logId: string) => {
    setMedicationLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? { ...log, status: 'taken', takenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : log
      )
    );
    // Add notification
    const log = medicationLogs.find((l) => l.id === logId);
    if (log) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Medication Taken',
          message: `Recorded ${log.medicationName} (${log.dosage}) as taken.`,
          timestamp: 'Just now',
          type: 'medication',
          isRead: false,
        },
        ...prev,
      ]);
    }
  };

  const snoozeMedication = (logId: string) => {
    setMedicationLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, status: 'snoozed' } : log))
    );
  };

  const skipMedication = (logId: string) => {
    setMedicationLogs((prev) =>
      prev.map((log) => (log.id === logId ? { ...log, status: 'missed' } : log))
    );
  };

  const addMedication = (medData: Omit<Medication, 'id'>) => {
    const newId = `med_${Date.now()}`;
    const newMed: Medication = { ...medData, id: newId };
    setMedications((prev) => [...prev, newMed]);

    // Create log for today
    const newLog: MedicationLog = {
      id: `log_${Date.now()}`,
      medicationId: newId,
      medicationName: medData.name,
      dosage: medData.dosage,
      scheduledTime: medData.times[0] || '08:00 AM',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setMedicationLogs((prev) => [newLog, ...prev]);
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = { ...aptData, id: `apt_${Date.now()}`, status: 'upcoming' };
    setAppointments((prev) => [newApt, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'New Appointment Scheduled',
        message: `${aptData.type} with ${aptData.doctorName} on ${aptData.date} at ${aptData.time}.`,
        timestamp: 'Just now',
        type: 'appointment',
        isRead: false,
      },
      ...prev,
    ]);
  };

  const addVitalEntry = (vitalData: Omit<VitalEntry, 'id'>) => {
    const newVital: VitalEntry = { ...vitalData, id: `vit_${Date.now()}` };
    setVitals((prev) => [newVital, ...prev]);
  };

  const addReport = (reportData: Omit<MedicalReport, 'id'>) => {
    const newReport: MedicalReport = { ...reportData, id: `rep_${Date.now()}` };
    setReports((prev) => [newReport, ...prev]);
  };

  const regenerateEmergencyToken = () => {
    const newTok = `tok_sec_${Math.random().toString(36).substring(2, 11)}`;
    setUser((prev) => ({ ...prev, emergencyToken: newTok }));
    setEmergencyAccessLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        location: 'User Action (App Settings)',
        device: 'AuraMedical Security Manager',
        ip: 'Security Reset',
      },
      ...prev,
    ]);
  };

  // Aura AI App Control Tool Executor
  const executeAuraTool = (toolName: string, params?: Record<string, any>) => {
    console.log(`Executing Aura Tool: ${toolName}`, params);
    switch (toolName) {
      case 'open_dashboard':
        setActiveTab('dashboard');
        break;
      case 'open_medications':
        setActiveTab('medications');
        break;
      case 'open_appointments':
        setActiveTab('appointments');
        break;
      case 'open_reports':
        setActiveTab('reports');
        break;
      case 'open_health_monitor':
        setActiveTab('health_monitor');
        break;
      case 'open_emergency_passport':
        setActiveTab('emergency_passport');
        break;
      case 'find_nearby_pharmacies':
        setActiveTab('pharmacies');
        break;
      case 'create_medication_reminder':
        if (params?.name) {
          addMedication({
            name: params.name,
            dosage: params.dosage || 'Standard dose',
            frequency: params.frequency || 'Daily',
            times: [params.time || '08:00 AM'],
            mealTiming: 'after_food',
            instructions: 'Added via Aura Voice Assistant',
            startDate: new Date().toISOString().split('T')[0],
          });
        }
        setActiveTab('medications');
        break;
      case 'create_appointment':
        if (params?.doctorName) {
          addAppointment({
            doctorName: params.doctorName,
            hospital: params.hospital || 'General Clinic',
            department: 'Consultation',
            date: params.date || new Date().toISOString().split('T')[0],
            time: params.time || '10:00 AM',
            type: 'Doctor Consultation',
          });
        }
        setActiveTab('appointments');
        break;
      case 'show_health_trends':
        setActiveTab('health_monitor');
        break;
      case 'change_language':
        if (params?.languageCode && translations[params.languageCode as LanguageCode]) {
          setLanguage(params.languageCode as LanguageCode);
        }
        break;
      case 'show_notifications':
        setActiveTab('notifications');
        break;
      default:
        break;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        medications,
        setMedications,
        medicationLogs,
        setMedicationLogs,
        appointments,
        setAppointments,
        reports,
        setReports,
        vitals,
        setVitals,
        pharmacies,
        notifications,
        setNotifications,
        chatMessages,
        setChatMessages,
        isAuraOpen,
        setIsAuraOpen,
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        isOnboardingOpen,
        setIsOnboardingOpen,
        selectedReport,
        setSelectedReport,
        emergencyAccessLogs,
        takeMedication,
        snoozeMedication,
        skipMedication,
        addMedication,
        addAppointment,
        addVitalEntry,
        addReport,
        regenerateEmergencyToken,
        executeAuraTool,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
