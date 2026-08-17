import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DOCTORS_LIST,
  MEDICAL_LABS_LIST,
  Doctor,
  MedicalLab,
  LabTest,
} from '../../data/appointmentData';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  X,
  FileText,
  Building,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Phone,
  Search,
  Star,
  Award,
  Video,
  ShieldCheck,
  FlaskConical,
  Home,
  Check,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Microscope,
  Tag,
  CalendarCheck,
  Info,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const AppointmentView: React.FC = () => {
  const { appointments, addAppointment, setAppointments, addNotification } = useApp();

  // Active Main Tab: 'my_appointments' | 'doctors' | 'labs'
  const [activeTab, setActiveTab] = useState<'my_appointments' | 'doctors' | 'labs'>('my_appointments');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLabCategory, setSelectedLabCategory] = useState('All');

  // Booking Modal for Doctor
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [consultType, setConsultType] = useState<'In-Person Visit' | 'Video Consultation'>('In-Person Visit');
  const [docDate, setDocDate] = useState('2026-08-12');
  const [docTime, setDocTime] = useState('10:30 AM');
  const [visitNotes, setVisitNotes] = useState('');

  // Booking Modal for Lab Test
  const [selectedLab, setSelectedLab] = useState<MedicalLab | null>(null);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [collectionMethod, setCollectionMethod] = useState<'Home Sample Collection' | 'Walk-In Lab Center'>('Home Sample Collection');
  const [labDate, setLabDate] = useState('2026-08-11');
  const [labTime, setLabTime] = useState('08:00 AM');
  const [patientAddress, setPatientAddress] = useState('742 Evergreen Terrace, Suite 4B');

  // Reschedule State
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-08-15');
  const [newTime, setNewTime] = useState('11:00 AM');

  // View Pass / Instructions Modal
  const [activePassApt, setActivePassApt] = useState<any | null>(null);

  // Success Confirmation Notification
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const showSuccessToast = (msg: string) => {
    setBookingSuccessMsg(msg);
    setTimeout(() => setBookingSuccessMsg(null), 4000);
  };

  // Filtered Doctors
  const filteredDoctors = DOCTORS_LIST.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  // Filtered Labs
  const filteredLabs = MEDICAL_LABS_LIST.filter((lab) => {
    const matchesSearch =
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.testsOffered.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Doctor Booking Handler
  const handleConfirmDoctorBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    addAppointment({
      doctorName: selectedDoctor.name,
      hospital: selectedDoctor.hospital,
      department: `${selectedDoctor.specialty} (${consultType})`,
      date: docDate,
      time: docTime,
      type: `${selectedDoctor.specialty} Consultation`,
      notes: visitNotes || 'Routine consultation scheduled.',
    });

    addNotification({
      title: 'Appointment Booked Successfully',
      message: `Your consultation with ${selectedDoctor.name} at ${selectedDoctor.hospital} is confirmed for ${docDate} at ${docTime}.`,
      type: 'appointment',
    });

    showSuccessToast(`Booked consultation with ${selectedDoctor.name} for ${docDate} at ${docTime}!`);
    setDoctorModalOpen(false);
    setSelectedDoctor(null);
    setVisitNotes('');
    setActiveTab('my_appointments');
  };

  // Lab Test Booking Handler
  const handleConfirmLabBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab || !selectedTest) return;

    addAppointment({
      doctorName: `${selectedLab.name}`,
      hospital: selectedLab.address,
      department: `Diagnostic Lab (${collectionMethod})`,
      date: labDate,
      time: labTime,
      type: `Lab Test: ${selectedTest.name}`,
      notes: `${selectedTest.name} - ${collectionMethod}. ${selectedTest.fastingRequired ? '10-12 hr Fasting required.' : 'No fasting required.'}`,
    });

    addNotification({
      title: 'Lab Test Scheduled',
      message: `${selectedTest.name} scheduled at ${selectedLab.name} (${collectionMethod}) for ${labDate} at ${labTime}.`,
      type: 'appointment',
    });

    showSuccessToast(`Lab test "${selectedTest.name}" scheduled at ${selectedLab.name}!`);
    setLabModalOpen(false);
    setSelectedLab(null);
    setSelectedTest(null);
    setActiveTab('my_appointments');
  };

  // Reschedule Handler
  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAptId) return;

    setAppointments((prev) =>
      prev.map((a) => (a.id === rescheduleAptId ? { ...a, date: newDate, time: newTime } : a))
    );

    addNotification({
      title: 'Appointment Rescheduled',
      message: `Your appointment has been rescheduled to ${newDate} at ${newTime}.`,
      type: 'appointment',
    });

    showSuccessToast(`Appointment rescheduled to ${newDate} at ${newTime}`);
    setRescheduleAptId(null);
  };

  // Cancel Handler
  const handleCancelApt = (id: string, name: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );

    addNotification({
      title: 'Appointment Cancelled',
      message: `Appointment with ${name} has been cancelled.`,
      type: 'appointment',
    });

    showSuccessToast(`Appointment with ${name} cancelled`);
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');
  const pastAppointments = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  const specialtiesList = ['All', 'Cardiology', 'Endocrinology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Banner */}
      {bookingSuccessMsg && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 font-semibold text-xs border border-emerald-400">
          <CheckCircle className="w-5 h-5 text-white" />
          <span>{bookingSuccessMsg}</span>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Interactive Healthcare & Appointment Hub</h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Book top specialists, schedule diagnostic lab tests, and manage your health visits seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('my_appointments')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'my_appointments'
                ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>My Visits ({upcomingAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'doctors'
                ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Find Doctors</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'labs'
                ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Medical Labs</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY APPOINTMENTS */}
      {activeTab === 'my_appointments' && (
        <div className="space-y-6">
          {/* Quick Schedule Doctor Button */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary-container/40 via-surface to-secondary-container/40 p-5 rounded-3xl border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <strong className="text-sm text-on-surface block">Need to book a new appointment or lab test?</strong>
                <span className="text-xs text-on-surface-variant">Browse verified doctors or diagnostic centers with instant slot confirmation.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('doctors')}
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110 transition-all shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Find Doctors</span>
              </button>
              <button
                onClick={() => setActiveTab('labs')}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5 text-secondary" />
                <span>Book Lab Test</span>
              </button>
            </div>
          </div>

          {/* Upcoming Consultations */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-secondary" />
                <span>Upcoming Scheduled Visits ({upcomingAppointments.length})</span>
              </h2>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-10 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30 space-y-3">
                <CalendarIcon className="w-10 h-10 text-on-surface-variant mx-auto opacity-40" />
                <p className="text-sm font-semibold text-on-surface">No upcoming appointments scheduled</p>
                <p className="text-xs text-on-surface-variant">Search our doctor panel or diagnostic labs to book your next visit.</p>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="px-5 py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs inline-flex items-center gap-2 hover:brightness-110 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Specialist Doctors</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingAppointments.map((apt) => {
                  const isLab = apt.type.toLowerCase().includes('lab test');
                  return (
                    <div
                      key={apt.id}
                      className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                isLab ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-secondary-container/60 text-secondary border border-secondary/20'
                              }`}
                            >
                              {isLab ? <FlaskConical className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-on-surface">{apt.doctorName}</h3>
                              <span className="text-xs text-secondary font-semibold">{apt.department}</span>
                            </div>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-secondary-container text-secondary text-xs font-bold shrink-0">
                            {apt.date}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-on-surface-variant bg-surface/70 p-3 rounded-xl border border-outline-variant/20">
                          <div className="flex items-center gap-2">
                            <Building className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                            <span className="font-semibold text-on-surface">{apt.hospital}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span>Time Slot: <strong className="text-on-surface">{apt.time}</strong></span>
                          </div>
                          {apt.notes && (
                            <div className="pt-1.5 border-t border-outline-variant/20 text-[11px] text-on-surface italic">
                              "{apt.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setActivePassApt(apt)}
                          className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Info className="w-3.5 h-3.5 text-secondary" />
                          <span>View Pass & Preparation</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setRescheduleAptId(apt.id);
                              setNewDate(apt.date);
                              setNewTime(apt.time);
                            }}
                            className="text-xs text-secondary font-semibold hover:underline"
                          >
                            Reschedule
                          </button>
                          <span className="text-on-surface-variant">•</span>
                          <button
                            onClick={() => handleCancelApt(apt.id, apt.doctorName)}
                            className="text-xs text-on-surface-variant hover:text-error transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Consultations */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-on-surface">Past Consultations & Clinical History</h2>

            <div className="space-y-3">
              {pastAppointments.length === 0 ? (
                <p className="text-xs text-on-surface-variant py-4 text-center">No past appointment history.</p>
              ) : (
                pastAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-on-surface">{apt.doctorName}</strong>
                          <span className="text-xs text-on-surface-variant">• {apt.type}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{apt.hospital} — {apt.date} at {apt.time}</p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                        apt.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {apt.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIND & BOOK DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          {/* Search & Specialty Filters Bar */}
          <div className="bg-surface p-5 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty (e.g. Cardiology, Neurology), or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              <span className="text-xs font-bold text-on-surface-variant shrink-0 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Specialty:
              </span>
              {specialtiesList.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSpecialty === spec
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs hover:border-secondary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-secondary/30 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-base text-on-surface leading-snug">{doc.name}</h3>
                        <span className="text-xs font-semibold text-secondary block">{doc.specialty}</span>
                        <span className="text-[11px] text-on-surface-variant">{doc.qualifications}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 text-xs font-bold flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" /> {doc.rating}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {doc.about}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="font-semibold text-on-surface truncate">{doc.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-on-surface-variant">Experience: <strong>{doc.experienceYears} yrs</strong></span>
                      <span className="text-sm font-extrabold text-on-surface">${doc.fee} <span className="text-[10px] text-on-surface-variant font-normal">/ visit</span></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setDoctorModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>Book Appointment (${doc.fee})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL TEST LABS */}
      {activeTab === 'labs' && (
        <div className="space-y-6">
          {/* Diagnostic Hub Info Banner */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-secondary" />
                  <h2 className="text-base font-bold text-on-surface">Verified Diagnostic & Clinical Test Labs</h2>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  Schedule blood tests, lipid panels, thyroid profiles, or full body executive checkups with home sample collection.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-1.5">
                  <Home className="w-4 h-4" /> Free Home Sample Pickup
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Express 6-Hour Reports
                </span>
              </div>
            </div>

            <div className="relative pt-2">
              <Search className="w-4.5 h-4.5 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search test labs or specific tests (e.g., CBC, Lipid Profile, Thyroid, Ultrasound)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>
          </div>

          {/* Labs & Tests Directory */}
          <div className="space-y-6">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-surface p-6 rounded-3xl border border-outline-variant/30 shadow-xs space-y-5"
              >
                {/* Lab Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-on-surface">{lab.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 text-xs font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" /> {lab.rating} ({lab.reviewCount})
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{lab.address} • <strong>{lab.distanceKm} km away</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {lab.homeCollectionAvailable && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-xs font-bold flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" /> Home Collection
                      </span>
                    )}
                    {lab.expressReportAvailable && (
                      <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Fast AI Analysis
                      </span>
                    )}
                  </div>
                </div>

                {/* Tests Offered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lab.testsOffered.map((test) => (
                    <div
                      key={test.id}
                      className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-secondary/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-secondary font-bold text-[10px] uppercase tracking-wider">
                              {test.category}
                            </span>
                            <h4 className="font-bold text-sm text-on-surface mt-1">{test.name}</h4>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-base font-extrabold text-on-surface">${test.price}</span>
                            <span className="text-xs text-on-surface-variant line-through block text-[11px]">${test.originalPrice}</span>
                          </div>
                        </div>

                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                          {test.description}
                        </p>

                        <div className="mt-3 flex items-center gap-3 text-[11px] text-on-surface-variant font-medium">
                          <span>📊 {test.parametersCount} Parameters</span>
                          <span>•</span>
                          <span>⏱ {test.turnaroundHours} hrs turnaround</span>
                          {test.fastingRequired && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 font-bold">⚠️ Fasting Required</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedLab(lab);
                          setSelectedTest(test);
                          setLabModalOpen(true);
                        }}
                        className="w-full py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110 transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Book Test (${test.price})</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: BOOK DOCTOR CONSULTATION */}
      {doctorModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-secondary/30"
                />
                <div>
                  <h3 className="font-bold text-base text-on-surface">{selectedDoctor.name}</h3>
                  <span className="text-xs text-secondary font-semibold">{selectedDoctor.specialty} • {selectedDoctor.hospital}</span>
                </div>
              </div>

              <button
                onClick={() => setDoctorModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDoctorBooking} className="space-y-4">
              {/* Visit Type Selector */}
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1.5">Consultation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('In-Person Visit')}
                    className={`py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      consultType === 'In-Person Visit'
                        ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>In-Person Clinic Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('Video Consultation')}
                    className={`py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      consultType === 'Video Consultation'
                        ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Consultation</span>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Appointment Date</label>
                <input
                  type="date"
                  required
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              {/* Time Slot Grid */}
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1.5">Select Available Time Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedDoctor.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setDocTime(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        docTime === slot
                          ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason for Visit / Symptoms */}
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Symptoms or Reason for Consultation</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Routine blood pressure evaluation and medication review"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              {/* Fee Summary */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">Consultation Fee:</span>
                <strong className="text-sm font-extrabold text-on-surface">${selectedDoctor.fee}.00</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xs"
                >
                  Confirm & Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOK LAB TEST */}
      {labModalOpen && selectedLab && selectedTest && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-lg w-full p-6 border border-outline-variant/30 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{selectedLab.name}</span>
                <h3 className="font-bold text-base text-on-surface">{selectedTest.name}</h3>
              </div>

              <button
                onClick={() => setLabModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLabBooking} className="space-y-4">
              {/* Collection Method */}
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1.5">Sample Collection Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCollectionMethod('Home Sample Collection')}
                    className={`py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      collectionMethod === 'Home Sample Collection'
                        ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home Sample Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionMethod('Walk-In Lab Center')}
                    className={`py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      collectionMethod === 'Walk-In Lab Center'
                        ? 'bg-secondary text-on-secondary border-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>Walk-In Center Visit</span>
                  </button>
                </div>
              </div>

              {collectionMethod === 'Home Sample Collection' && (
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Pickup Address</label>
                  <input
                    type="text"
                    required
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={labDate}
                    onChange={(e) => setLabDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Time Slot</label>
                  <select
                    value={labTime}
                    onChange={(e) => setLabTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none focus:ring-2 focus:ring-secondary/40"
                  >
                    {selectedLab.availableSlots.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fasting Reminder */}
              {selectedTest.fastingRequired && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-100 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Fasting Requirement:</strong> Do not consume food or caloric beverages for 10-12 hours prior to sample collection. Water is allowed.</span>
                </div>
              )}

              {/* Price summary */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium">Test Charge:</span>
                <strong className="text-sm font-extrabold text-on-surface">${selectedTest.price}.00</strong>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLabModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xs"
                >
                  Schedule Lab Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESCHEDULE APPOINTMENT */}
      {rescheduleAptId && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-secondary" />
                <span>Reschedule Appointment</span>
              </h3>
              <button
                onClick={() => setRescheduleAptId(null)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold outline-none"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleAptId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110 transition-all shadow-xs"
                >
                  Save New Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW PASS & PREPARATION INSTRUCTIONS */}
      {activePassApt && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 border border-outline-variant/30 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-on-surface">Digital Appointment Pass</h3>
              </div>
              <button
                onClick={() => setActivePassApt(null)}
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">Provider / Doctor:</span>
                <strong className="text-on-surface">{activePassApt.doctorName}</strong>
              </div>
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">Facility / Hospital:</span>
                <span className="font-semibold text-on-surface">{activePassApt.hospital}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">Scheduled Date:</span>
                <strong className="text-secondary">{activePassApt.date} at {activePassApt.time}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Booking Token ID:</span>
                <span className="font-mono text-on-surface font-bold">APT-{activePassApt.id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-on-surface uppercase tracking-wider">Pre-Visit Preparation Checklist</h4>
              <ul className="space-y-1.5 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Bring past medical reports, lipid profiles, or blood test histories.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Carry active medication prescriptions or bottle labels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Arrive 10 minutes before your scheduled time slot.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActivePassApt(null)}
                className="px-5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:brightness-110"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
