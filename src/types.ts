export type UserRole = 'patient' | 'doctor' | 'hospital_staff' | 'emergency_responder' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn' | 'gu';

export interface UserProfile {
  id: string;
  name: string;
  patientId: string; // e.g. "AH7829"
  email: string;
  role: UserRole;
  avatarUrl: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  language: LanguageCode;
  theme: 'light' | 'dark' | 'system';
  emergencyToken: string;
  emergencyContacts: {
    id: string;
    name: string;
    relation: string;
    phone: string;
  }[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "Daily", "Twice a day"
  times: string[]; // e.g., ["08:00", "20:00"]
  mealTiming: 'before_food' | 'after_food' | 'with_water' | 'as_needed';
  instructions: string;
  startDate: string;
  endDate?: string;
  prescriptionAttachment?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: 'taken' | 'missed' | 'snoozed' | 'pending';
  takenAt?: string;
  date: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  hospital: string;
  department: string;
  date: string;
  time: string;
  type: string; // e.g. "Cardiology Follow-up", "Dental Checkup"
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  documentAttachment?: string;
}

export interface ReportParameter {
  name: string;
  value: number;
  unit: string;
  referenceLow: number;
  referenceHigh: number;
  status: 'normal' | 'high' | 'low' | 'attention';
  explanation: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  reportType: 'CBC' | 'Lipid Profile' | 'Blood Glucose' | 'Thyroid' | 'Liver Function' | 'Kidney Function' | 'Urine' | 'ECG' | 'Other';
  date: string;
  fileUrl?: string;
  fileName?: string;
  status: 'analyzing' | 'completed' | 'attention';
  summary: string;
  simpleExplanation: string;
  parameters: ReportParameter[];
  observations: string[];
  questionsForDoctor: string[];
}

export interface VitalEntry {
  id: string;
  date: string;
  time: string;
  heartRate: number; // bpm
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  spo2: number; // %
  temperature: number; // °F or °C
  glucose: number; // mg/dL
  weight: number; // kg
  sleepHours: number; // hrs
}

export interface EmergencyAccessLog {
  id: string;
  timestamp: string;
  location: string;
  device: string;
  ip: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  rating: number;
  phone: string;
  isOpen: boolean;
  is24x7: boolean;
  stockAvailability: {
    medicationName: string;
    status: 'available' | 'low_stock' | 'call_to_confirm' | 'unavailable';
  }[];
  lat: number;
  lng: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'medication' | 'appointment' | 'report' | 'alert' | 'emergency' | 'system';
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  timestamp: string;
  toolCall?: {
    toolName: string;
    params?: Record<string, any>;
    status: 'executing' | 'completed' | 'failed';
  };
  language?: LanguageCode;
}

export interface TriageCategory {
  urgency: 'Emergency' | 'Urgent' | 'Routine';
  guidance: string;
  recommendedAction: string;
}
