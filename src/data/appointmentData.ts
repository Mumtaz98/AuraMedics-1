export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hospital: string;
  location: string;
  fee: number;
  avatarUrl: string;
  availableToday: boolean;
  qualifications: string;
  languages: string[];
  about: string;
  timeSlots: string[];
}

export interface LabTest {
  id: string;
  name: string;
  category: 'Blood Test' | 'Radiology' | 'Full Body Checkup' | 'Diabetes' | 'Cardiac';
  price: number;
  originalPrice: number;
  turnaroundHours: number;
  fastingRequired: boolean;
  description: string;
  parametersCount: number;
}

export interface MedicalLab {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  distanceKm: number;
  phone: string;
  homeCollectionAvailable: boolean;
  expressReportAvailable: boolean;
  testsOffered: LabTest[];
  availableSlots: string[];
}

export const DOCTORS_LIST: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 320,
    hospital: 'City Heart & Vascular Center',
    location: 'Downtown Medical District',
    fee: 80,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250',
    availableToday: true,
    qualifications: 'MD (Cardiology), FACC',
    languages: ['English', 'Hindi'],
    about: 'Senior Cardiologist specializing in preventive cardiology, lipid disorder management, and non-invasive cardiac evaluation.',
    timeSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
  },
  {
    id: 'doc_2',
    name: 'Dr. Aris Thorne',
    specialty: 'Internal Medicine & Endocrinology',
    experienceYears: 18,
    rating: 4.95,
    reviewCount: 480,
    hospital: 'Aura Advanced Clinical Institute',
    location: 'Central Health Hub',
    fee: 95,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250',
    availableToday: true,
    qualifications: 'MD, DM (Endocrinology)',
    languages: ['English', 'Telugu'],
    about: 'Specialist in metabolic health, Type 2 diabetes management, thyroid care, and comprehensive adult internal medicine.',
    timeSlots: ['09:30 AM', '11:00 AM', '03:00 PM', '05:00 PM'],
  },
  {
    id: 'doc_3',
    name: 'Dr. Priya Sharma',
    specialty: 'Neurology',
    experienceYears: 12,
    rating: 4.85,
    reviewCount: 210,
    hospital: 'Metro Neuro & Brain Care',
    location: 'North Wing Health Park',
    fee: 110,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&q=80&w=250',
    availableToday: false,
    qualifications: 'MD, DM (Neurology)',
    languages: ['English', 'Hindi', 'Marathi'],
    about: 'Expert consultant for migraines, neuropathy, sleep architecture, and neurological rehabilitation.',
    timeSlots: ['10:00 AM', '01:30 PM', '03:30 PM'],
  },
  {
    id: 'doc_4',
    name: 'Dr. Marcus Vance',
    specialty: 'Orthopedics & Joint Care',
    experienceYears: 16,
    rating: 4.88,
    reviewCount: 390,
    hospital: 'St. Jude Orthopedic Center',
    location: 'Westside Medical Plaza',
    fee: 90,
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250',
    availableToday: true,
    qualifications: 'MS (Orthopedics), MCh',
    languages: ['English', 'Spanish'],
    about: 'Specialist in arthritis care, sports injuries, posture alignment, and minimally invasive joint procedures.',
    timeSlots: ['08:30 AM', '11:30 AM', '02:30 PM', '05:30 PM'],
  },
  {
    id: 'doc_5',
    name: 'Dr. Kavita Nair',
    specialty: 'Dermatology & Skin Care',
    experienceYears: 10,
    rating: 4.92,
    reviewCount: 510,
    hospital: 'Aura Aesthetics & Skin Clinic',
    location: 'East Park Boulevard',
    fee: 75,
    avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=250',
    availableToday: true,
    qualifications: 'MD (Dermatology), DNB',
    languages: ['English', 'Malayalam', 'Tamil'],
    about: 'Comprehensive dermatology care focusing on clinical skin conditions, allergy testing, and preventive dermatological therapy.',
    timeSlots: ['10:00 AM', '12:00 PM', '04:00 PM', '06:30 PM'],
  },
  {
    id: 'doc_6',
    name: 'Dr. Rajesh Patel',
    specialty: 'General Pediatrics',
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 340,
    hospital: 'Sunshine Childrens Hospital',
    location: 'Central Avenue',
    fee: 70,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250',
    availableToday: true,
    qualifications: 'MD (Pediatrics), DCH',
    languages: ['English', 'Gujarati', 'Hindi'],
    about: 'Dedicated pediatric practitioner specializing in childhood growth monitoring, vaccination schedules, and general pediatric care.',
    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM'],
  },
];

export const MEDICAL_LABS_LIST: MedicalLab[] = [
  {
    id: 'lab_1',
    name: 'Aura AI Clinical Diagnostics',
    rating: 4.95,
    reviewCount: 620,
    address: '742 Medical Innovation Drive, Suite 100',
    distanceKm: 1.2,
    phone: '+1 (800) 555-0199',
    homeCollectionAvailable: true,
    expressReportAvailable: true,
    availableSlots: ['07:00 AM', '08:00 AM', '09:30 AM', '11:00 AM', '02:00 PM'],
    testsOffered: [
      {
        id: 'test_1',
        name: 'Complete Blood Count (CBC) + ESR',
        category: 'Blood Test',
        price: 25,
        originalPrice: 40,
        turnaroundHours: 6,
        fastingRequired: false,
        description: 'Measures RBC, WBC, Hemoglobin, Hematocrit, Platelets, and Inflammation Rate.',
        parametersCount: 24,
      },
      {
        id: 'test_2',
        name: 'Comprehensive Lipid Panel',
        category: 'Cardiac',
        price: 35,
        originalPrice: 55,
        turnaroundHours: 8,
        fastingRequired: true,
        description: 'Measures Total Cholesterol, HDL, LDL, VLDL, and Triglycerides.',
        parametersCount: 8,
      },
      {
        id: 'test_3',
        name: 'HbA1c & Fasting Blood Glucose',
        category: 'Diabetes',
        price: 30,
        originalPrice: 45,
        turnaroundHours: 6,
        fastingRequired: true,
        description: 'Evaluates 3-month average blood glucose control and current fasting glucose level.',
        parametersCount: 4,
      },
      {
        id: 'test_4',
        name: 'Aura Executive Full-Body Health Check',
        category: 'Full Body Checkup',
        price: 120,
        originalPrice: 210,
        turnaroundHours: 12,
        fastingRequired: true,
        description: 'Complete 68-parameter screening including Kidney, Liver, Thyroid, Heart, and Vitamin D3/B12.',
        parametersCount: 68,
      },
    ],
  },
  {
    id: 'lab_2',
    name: 'Metropolis Advanced Diagnostic Hub',
    rating: 4.88,
    reviewCount: 410,
    address: '108 Healthcare Avenue, Central Square',
    distanceKm: 2.8,
    phone: '+1 (800) 555-0244',
    homeCollectionAvailable: true,
    expressReportAvailable: true,
    availableSlots: ['07:30 AM', '09:00 AM', '10:30 AM', '01:00 PM', '04:00 PM'],
    testsOffered: [
      {
        id: 'test_5',
        name: 'Thyroid Function Ultra (T3, T4, TSH)',
        category: 'Blood Test',
        price: 28,
        originalPrice: 45,
        turnaroundHours: 12,
        fastingRequired: false,
        description: 'Comprehensive thyroid hormone evaluation for hypo/hyperthyroidism screening.',
        parametersCount: 5,
      },
      {
        id: 'test_6',
        name: 'Liver Function Test (LFT) Profile',
        category: 'Blood Test',
        price: 32,
        originalPrice: 50,
        turnaroundHours: 8,
        fastingRequired: true,
        description: 'Measures SGOT, SGPT, Bilirubin, Alkaline Phosphatase, and Total Protein.',
        parametersCount: 11,
      },
      {
        id: 'test_7',
        name: 'Vitamin D3 & B12 Deficiency Panel',
        category: 'Full Body Checkup',
        price: 45,
        originalPrice: 75,
        turnaroundHours: 24,
        fastingRequired: false,
        description: 'Essential micronutrient screen for fatigue, bone density, and neurological health.',
        parametersCount: 2,
      },
    ],
  },
  {
    id: 'lab_3',
    name: 'Apollo Precision Radiology & Imaging',
    rating: 4.9,
    reviewCount: 380,
    address: '45 Imaging Parkway, West Health District',
    distanceKm: 3.5,
    phone: '+1 (800) 555-0388',
    homeCollectionAvailable: false,
    expressReportAvailable: true,
    availableSlots: ['08:00 AM', '10:00 AM', '12:00 PM', '03:00 PM', '05:00 PM'],
    testsOffered: [
      {
        id: 'test_8',
        name: 'Chest X-Ray Digital PA View',
        category: 'Radiology',
        price: 40,
        originalPrice: 60,
        turnaroundHours: 2,
        fastingRequired: false,
        description: 'High-resolution chest X-ray for pulmonary and cardiac shadow evaluation.',
        parametersCount: 1,
      },
      {
        id: 'test_9',
        name: 'Abdominal & Pelvic Ultrasound Scan',
        category: 'Radiology',
        price: 85,
        originalPrice: 120,
        turnaroundHours: 4,
        fastingRequired: true,
        description: 'Non-invasive sonography screen for liver, gallbladder, kidneys, and abdominal organs.',
        parametersCount: 12,
      },
    ],
  },
];
