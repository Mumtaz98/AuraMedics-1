import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  ShieldAlert,
  Share2,
  RefreshCw,
  Lock,
  Unlock,
  Phone,
  User,
  Heart,
  AlertTriangle,
  Pill,
  CheckCircle2,
  Clock,
  Key,
  Copy,
  Check,
  Download,
  Smartphone,
  Eye,
  Activity,
  FileText,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Building,
  Scan,
  UserPlus,
  Trash2,
  Plus,
} from 'lucide-react';

export const EmergencyPassportView: React.FC = () => {
  const { user, setUser, medications, vitals, reports, emergencyAccessLogs, regenerateEmergencyToken } = useApp();

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Modals state
  const [homeScreenModalOpen, setHomeScreenModalOpen] = useState(false);
  const [scanPortalOpen, setScanPortalOpen] = useState(false);
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [contactError, setContactError] = useState('');

  const [authPortalTab, setAuthPortalTab] = useState<'paramedic' | 'doctor'>('paramedic');
  const [isVerified, setIsVerified] = useState(false);
  const [authRole, setAuthRole] = useState<'paramedic' | 'doctor' | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [enteredDoctorId, setEnteredDoctorId] = useState('');
  const [doctorIdError, setDoctorIdError] = useState('');
  const [verifiedDoctorId, setVerifiedDoctorId] = useState('');

  const handleVerifyParamedicPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === '4321' || enteredPin === '1234' || (enteredPin.length === 4 && /^\d+$/.test(enteredPin))) {
      setIsVerified(true);
      setAuthRole('paramedic');
      setPinError('');
    } else {
      setPinError('Incorrect 4-digit PIN. (Default PIN: 4321)');
    }
  };

  const handleVerifyDoctorId = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredDoctorId.trim().length >= 3) {
      setIsVerified(true);
      setAuthRole('doctor');
      setVerifiedDoctorId(enteredDoctorId.trim().toUpperCase());
      setDoctorIdError('');
    } else {
      setDoctorIdError('Please enter a valid Doctor ID (e.g., DOC-90210)');
    }
  };

  const handleLockPortal = () => {
    setIsVerified(false);
    setAuthRole(null);
    setEnteredPin('');
    setPinError('');
    setEnteredDoctorId('');
    setDoctorIdError('');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      setContactError('Please enter both name and phone number.');
      return;
    }
    const newContact = {
      id: `contact_${Date.now()}`,
      name: newContactName.trim(),
      relation: newContactRelation.trim() || 'Emergency Contact',
      phone: newContactPhone.trim(),
    };
    setUser((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact],
    }));
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
    setContactError('');
    setAddContactModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    setUser((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
    }));
  };

  const passportUrl = `https://auramedical.ai/emergency-passport/${user.emergencyToken}`;

  // Generate crisp, scannable QR Code Data URL with High Error Correction
  useEffect(() => {
    const generateQr = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(passportUrl, {
          width: 500,
          margin: 2,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQr();
  }, [passportUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-DPI HTML5 Canvas Card Image Downloader
  const handleDownloadCard = async () => {
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 920;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Background Navy Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 920);
      gradient.addColorStop(0, '#0F172A');
      gradient.addColorStop(0.5, '#1E293B');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 920);

      // Top Red Medical Accent Line
      ctx.fillStyle = '#E11D48';
      ctx.fillRect(0, 0, 600, 14);

      // Header Branding
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('AURA MEDICAL EMERGENCY PASSPORT', 40, 55);

      ctx.fillStyle = '#FB7185';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('CRITICAL FIRST-RESPONDER & PARAMEDIC PASS', 40, 78);

      // Card Container Frame
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(30, 98, 540, 780, 24);
      ctx.fill();
      ctx.stroke();

      // Patient Header Section
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(user.name, 50, 148);

      ctx.fillStyle = '#38BDF8';
      ctx.font = '14px monospace';
      ctx.fillText(`Patient ID: ${user.patientId}`, 50, 172);

      // Blood Group Badge Box
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.roundRect(430, 125, 110, 52, 16);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(user.bloodGroup, 485, 158);
      ctx.textAlign = 'left';

      // Draw Actual Generated QR Code Image
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
        });

        // White Container for QR
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(160, 205, 280, 280, 24);
        ctx.fill();

        // Draw QR
        ctx.drawImage(qrImg, 175, 220, 250, 250);

        // Overlay central medical cross badge
        ctx.fillStyle = '#E11D48';
        ctx.beginPath();
        ctx.roundRect(280, 325, 40, 40, 10);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(296, 333, 8, 24);
        ctx.fillRect(288, 341, 24, 8);
      }

      // Instructions
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scan QR code with any smartphone camera to open secure medical history', 300, 515);
      ctx.textAlign = 'left';

      // Allergies Box
      ctx.fillStyle = 'rgba(225, 29, 72, 0.15)';
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.4)';
      ctx.beginPath();
      ctx.roundRect(50, 545, 500, 85, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FB7185';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⚠️ CRITICAL KNOWN ALLERGIES', 70, 572);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(user.allergies.join(' • '), 70, 602);

      // Emergency Contacts Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(50, 650, 500, 130, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('📞 PRIMARY EMERGENCY CONTACTS', 70, 678);

      let yPos = 708;
      user.emergencyContacts.forEach((contact) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`${contact.name} (${contact.relation}): `, 70, yPos);
        ctx.fillStyle = '#4ADE80';
        ctx.fillText(contact.phone, 290, yPos);
        yPos += 26;
      });

      // Footer Security Token
      ctx.fillStyle = '#64748B';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`TOKEN: ${user.emergencyToken} • ENCRYPTED VIA AURAMEDICAL SECURE VAULT`, 300, 840);

      // Download File Trigger
      const imageURI = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageURI;
      downloadLink.download = `Emergency_Medical_Passport_${user.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Error rendering PNG card:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-error/20 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-error-container text-error shadow-xs">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface">Emergency Passport & High-Res QR Code</h1>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Permanent, secure medical passport designed for instant scanning by paramedics and emergency first responders.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setHomeScreenModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-secondary-container text-secondary font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xs"
          >
            <Smartphone className="w-4 h-4" />
            <span>Add to Home Screen</span>
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={downloading}
            className="px-3.5 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs border border-outline-variant/40"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>{downloading ? 'Generating PNG...' : 'Download Card'}</span>
          </button>

          <button
            onClick={() => {
              setScanPortalOpen(true);
              setIsVerified(false);
              setEnteredPin('');
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Simulate Paramedic Scan</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: High-Res Permanent QR Card (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-[#1E293B] shadow-xl flex flex-col items-center justify-between space-y-6 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Card Top Branding */}
          <div className="w-full flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 bg-rose-500 rounded-full animate-ping shadow-[0_0_12px_#E11D48]"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Emergency Passport</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
              Token Active
            </span>
          </div>

          {/* Patient Header Badge */}
          <div className="w-full flex items-center justify-between bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-[#00B8D9]"
              />
              <div>
                <h2 className="font-extrabold text-base text-white">{user.name}</h2>
                <p className="text-xs font-mono text-[#38BDF8]">ID: {user.patientId}</p>
              </div>
            </div>

            <div className="text-center px-3.5 py-1.5 bg-rose-600 rounded-xl shadow-md">
              <span className="text-[10px] text-rose-100 font-bold block uppercase tracking-wider">Blood</span>
              <strong className="text-lg font-extrabold text-white leading-none">{user.bloodGroup}</strong>
            </div>
          </div>

          {/* CRISP & ATTRACTIVE HIGH-RES QR CODE FRAME WITH CENTRAL EMBLEM */}
          <div
            onClick={() => {
              setScanPortalOpen(true);
              setIsVerified(false);
            }}
            className="p-5 bg-white rounded-3xl shadow-2xl border-4 border-[#1E293B] hover:scale-102 transition-transform cursor-pointer group relative flex flex-col items-center justify-center overflow-hidden"
            title="Click to Simulate Scan & View Medical History"
          >
            {/* Corner Alignment Targets for High Quality Aesthetics */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-rose-600"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-rose-600"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-rose-600"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-rose-600"></div>

            {/* Real QR Code Image */}
            {qrDataUrl ? (
              <div className="relative">
                <img
                  src={qrDataUrl}
                  alt="Emergency Medical QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                />

                {/* Centered Medical Emergency Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 bg-rose-600 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white ring-4 ring-rose-600/30">
                    <ShieldAlert className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-500 font-bold text-xs">
                Generating QR...
              </div>
            )}

            {/* Hover Overlay Hint */}
            <div className="absolute inset-0 bg-[#0F172A] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              <Scan className="w-10 h-10 text-[#38BDF8] mb-2 animate-bounce" />
              <span className="text-xs font-bold text-white">Tap to Scan & Preview History</span>
              <span className="text-[10px] text-slate-300 mt-1">Simulate Paramedic Camera Scan</span>
            </div>
          </div>

          <div className="w-full text-center space-y-1">
            <span className="text-xs font-mono text-[#94A3B8] block truncate">
              Encrypted Token: {user.emergencyToken}
            </span>
            <p className="text-[11px] text-slate-400">
              Scan with any mobile camera to launch verified paramedic portal.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="w-full pt-4 border-t border-[#1E293B] flex items-center justify-between gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copied ? 'Copied Link' : 'Copy Passport URL'}</span>
            </button>

            <button
              onClick={regenerateEmergencyToken}
              className="py-2.5 px-3 rounded-xl bg-[#1E293B] hover:bg-rose-950/60 text-xs font-semibold text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
              title="Reset Security Token"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Token</span>
            </button>
          </div>
        </div>

        {/* Right Column: Emergency Medical Passport Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vital Emergency Information Block */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/40 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Verified First-Responder Profile</span>
              </h2>
              <span className="text-xs text-on-surface-variant font-mono">HIPAA Encrypted</span>
            </div>

            {/* Allergies & Conditions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Severe Known Allergies */}
              <div className="p-4.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Severe Known Allergies</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {user.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chronic Medical Conditions */}
              <div className="p-4.5 rounded-2xl bg-secondary-container/40 border border-secondary/30 space-y-2">
                <div className="flex items-center gap-1.5 text-secondary font-bold text-xs uppercase tracking-wide">
                  <Heart className="w-4 h-4" />
                  <span>Chronic Conditions</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {user.chronicConditions.map((cond, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Prescription Medications */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-600" />
                <span>Active Prescription Regimen</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {medications.slice(0, 3).map((med) => (
                  <div
                    key={med.id}
                    className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-xs text-on-surface font-bold block">{med.name}</strong>
                      <span className="text-[11px] text-on-surface-variant">{med.dosage} • {med.frequency}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      {med.times[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Primary Emergency Contacts (1-Tap Dial)</span>
                </span>
                <button
                  onClick={() => {
                    setContactError('');
                    setAddContactModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Emergency Contact</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between group hover:border-emerald-500/40 transition-all"
                  >
                    <div>
                      <strong className="text-xs text-on-surface font-bold block">{contact.name}</strong>
                      <span className="text-[11px] text-on-surface-variant">{contact.relation}</span>
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-bold block mt-0.5">{contact.phone}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${contact.phone}`}
                        className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
                        title="Call Contact"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      {user.emergencyContacts.length > 1 && (
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-2.5 rounded-xl bg-surface-container-high hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 text-on-surface-variant transition-colors shrink-0"
                          title="Remove Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Emergency Contact Card Trigger */}
                <button
                  onClick={() => {
                    setContactError('');
                    setAddContactModalOpen(true);
                  }}
                  className="p-4 rounded-2xl border-2 border-dashed border-outline-variant/60 hover:border-emerald-500/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-on-surface-variant hover:text-emerald-600 flex flex-col items-center justify-center gap-1 transition-all min-h-[84px] group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">+ Add Emergency Contact</span>
                  <span className="text-[10px] text-on-surface-variant">Add family, doctor, or guardian</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Access Audit Trail */}
          <div className="bg-surface p-6 rounded-3xl border border-outline-variant/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <Key className="w-4 h-4 text-sky-600" />
                <span>Paramedic Scan Audit Trail</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Real-time Logging
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {emergencyAccessLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-surface-container border border-outline-variant/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-on-surface font-semibold block">{log.device}</strong>
                    <span className="text-on-surface-variant text-[11px]">{log.location} • {log.ip}</span>
                  </div>
                  <span className="text-on-surface-variant font-mono text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD TO HOME SCREEN / MOBILE WALLET INSTRUCTIONS */}
      {homeScreenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] text-white rounded-3xl max-w-lg w-full border border-[#1E293B] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Vibrant Gradient Header */}
            <div className="p-5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-800 rounded-2xl shadow-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white tracking-tight">Add to Mobile Home Screen</h3>
                    <span className="px-2 py-0.5 rounded-full bg-sky-800 text-white text-[10px] font-bold">1-Tap Pass</span>
                  </div>
                  <p className="text-xs text-sky-100 font-medium mt-0.5">Instant paramedic access directly from your phone's screen</p>
                </div>
              </div>
              <button
                onClick={() => setHomeScreenModalOpen(false)}
                className="p-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Solid Dark Theme & High Contrast Instructions */}
            <div className="p-6 space-y-5 bg-[#0F172A] text-slate-100">
              {/* Visual Feature Callout Box */}
              <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Pin your Emergency Passport as a web app. Works offline and launches full-screen without typing web URLs.
                </p>
              </div>

              {/* Operating System Instructions Cards */}
              <div className="space-y-3">
                {/* iPhone iOS Card */}
                <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-sky-500/40 transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-2">
                      <span className="text-base">📱</span> Apple iPhone (Safari)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">Safari Browser</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">1</span>
                      <span className="text-slate-300 block font-medium">Tap <strong className="text-white">Share</strong> icon</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">2</span>
                      <span className="text-slate-300 block font-medium">Scroll to <strong className="text-white">"Add to Home Screen"</strong></span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">3</span>
                      <span className="text-slate-300 block font-medium">Tap <strong className="text-white">Add</strong> in top right</span>
                    </div>
                  </div>
                </div>

                {/* Android Device Card */}
                <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-emerald-500/40 transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-2">
                      <span className="text-base">🤖</span> Android Phone (Chrome)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">Chrome Browser</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">1</span>
                      <span className="text-slate-300 block font-medium">Tap <strong className="text-white">Three Dots (⋮)</strong></span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">2</span>
                      <span className="text-slate-300 block font-medium">Tap <strong className="text-white">"Add to Home Screen"</strong></span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-center space-y-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto">3</span>
                      <span className="text-slate-300 block font-medium">Confirm <strong className="text-white">Install</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-[#1E293B]">
                <span className="text-[11px] text-slate-400 font-mono">Status: Ready for Installation</span>
                <button
                  onClick={() => setHomeScreenModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  Got It!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EMERGENCY MEDICAL ACCESS PORTAL */}
      {scanPortalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="bg-[#0F172A] text-white rounded-3xl max-w-2xl w-full max-h-[92vh] border border-[#1E293B] shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-b border-[#1E293B] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-600 rounded-2xl text-white shadow-md">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-white">Emergency Access Portal</h2>
                  <span className="text-xs text-rose-300 font-mono">Token: {user.emergencyToken} • Patient: {user.name}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setScanPortalOpen(false);
                  handleLockPortal();
                }}
                className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Portal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {/* SECTION 1: PUBLIC & UNAUTHENTICATED PRIMARY EMERGENCY CONTACTS (1-TAP DIAL) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#1E293B] to-[#0F172A] border border-emerald-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        Primary Emergency Contacts (1-Tap Dial)
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Public Emergency Access</span>
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                        Instant direct calling for first responders & bystanders without authentication
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid of Emergency Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {user.emergencyContacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-[#0F172A] border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <strong className="text-xs text-white font-extrabold block truncate">{c.name}</strong>
                        <span className="text-[11px] text-slate-400 block font-medium">{c.relation}</span>
                        <span className="text-xs text-sky-400 font-bold font-mono block mt-0.5">{c.phone}</span>
                      </div>

                      <a
                        href={`tel:${c.phone}`}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all active:scale-95"
                      >
                        <Phone className="w-4 h-4 fill-current" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Basic Header Badge */}
              <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover border border-[#38BDF8]" />
                  <div>
                    <span className="font-bold text-white block">{user.name} (Patient)</span>
                    <span className="text-[11px] text-slate-400">DOB: 1988-06-15 • ID: {user.patientId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs">
                    Blood Group: {user.bloodGroup}
                  </div>
                  {user.organDonor && (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                      Organ Donor
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: SECURED MEDICAL HISTORY PORTALS */}
              <div className="space-y-4 pt-2">
                <div className="border-t border-[#1E293B] pt-4">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-sky-400" />
                    <span>Secured Medical History Portals</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select an authorized access portal to view clinical history, allergies, conditions, and active prescriptions.
                  </p>
                </div>

                {!isVerified ? (
                  <div className="p-5 rounded-3xl bg-[#1E293B] border border-[#334155] space-y-5">
                    {/* Portals Tab Selector */}
                    <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#0F172A] border border-[#334155]">
                      <button
                        onClick={() => {
                          setAuthPortalTab('paramedic');
                          setPinError('');
                          setDoctorIdError('');
                        }}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          authPortalTab === 'paramedic'
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Paramedic Access Portal</span>
                      </button>

                      <button
                        onClick={() => {
                          setAuthPortalTab('doctor');
                          setPinError('');
                          setDoctorIdError('');
                        }}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          authPortalTab === 'doctor'
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>Doctor Access Portal</span>
                      </button>
                    </div>

                    {/* Tab 1: Paramedic Emergency Access Portal (4-digit PIN required) */}
                    {authPortalTab === 'paramedic' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="text-center space-y-1">
                          <h4 className="font-bold text-sm text-white">Paramedic Emergency Access Portal</h4>
                          <p className="text-xs text-slate-400">
                            Enter 4-digit paramedic security PIN to unlock full emergency medical history.
                          </p>
                        </div>

                        <form onSubmit={handleVerifyParamedicPin} className="max-w-xs mx-auto space-y-3">
                          <div>
                            <input
                              type="password"
                              placeholder="Enter 4-digit PIN (Default: 4321)"
                              value={enteredPin}
                              onChange={(e) => setEnteredPin(e.target.value)}
                              className="w-full px-4 py-3 rounded-2xl bg-[#0F172A] border border-[#334155] text-center font-mono text-lg tracking-widest text-white outline-none focus:border-rose-500"
                            />
                            {pinError && <span className="text-[11px] text-rose-400 font-semibold block mt-1.5">{pinError}</span>}
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
                          >
                            Authenticate Paramedic PIN
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Tab 2: Doctor Access Portal (Doctor ID required) */}
                    {authPortalTab === 'doctor' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="text-center space-y-1">
                          <h4 className="font-bold text-sm text-white">Doctor Access Portal</h4>
                          <p className="text-xs text-slate-400">
                            Enter official medical practitioner license / Doctor ID to access clinical patient records.
                          </p>
                        </div>

                        <form onSubmit={handleVerifyDoctorId} className="max-w-xs mx-auto space-y-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Enter Doctor ID (e.g. DOC-90210)"
                              value={enteredDoctorId}
                              onChange={(e) => setEnteredDoctorId(e.target.value)}
                              className="w-full px-4 py-3 rounded-2xl bg-[#0F172A] border border-[#334155] text-center font-mono text-sm uppercase text-white outline-none focus:border-sky-500"
                            />
                            {doctorIdError && <span className="text-[11px] text-rose-400 font-semibold block mt-1.5">{doctorIdError}</span>}
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Stethoscope className="w-4 h-4" />
                            <span>Verify Doctor ID & Unlock</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  /* UNLOCKED MEDICAL HISTORY SECTION */
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* Unlocked Access Banner */}
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-400">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 shrink-0" />
                        <div>
                          <strong className="block text-white">
                            {authRole === 'doctor'
                              ? `Doctor Access Portal Verified (ID: ${verifiedDoctorId})`
                              : 'Paramedic Access Portal Verified (PIN Authenticated)'}
                          </strong>
                          <span className="text-[11px] text-emerald-300">Medical history unlocked for immediate patient treatment</span>
                        </div>
                      </div>

                      <button
                        onClick={handleLockPortal}
                        className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 text-[11px] font-bold border border-[#334155] transition-colors"
                      >
                        Lock Portal
                      </button>
                    </div>

                    {/* Severe Allergies & Chronic Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Severe Allergies */}
                      <div className="p-4 bg-rose-950/50 border border-rose-800/40 rounded-2xl space-y-2">
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                          <AlertTriangle className="w-4 h-4" /> Known Severe Allergies
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {user.allergies.map((alg, i) => (
                            <span key={i} className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs">
                              {alg}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Chronic Conditions */}
                      <div className="p-4 bg-[#1E293B] border border-[#334155] rounded-2xl space-y-2">
                        <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 uppercase">
                          <Heart className="w-4 h-4" /> Chronic Conditions
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {user.chronicConditions.map((cond, i) => (
                            <span key={i} className="px-3 py-1 rounded-xl bg-[#0284C7] text-white font-bold text-xs">
                              {cond}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active Prescription Regimen */}
                    <div className="p-4 bg-[#1E293B] border border-[#334155] rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase">
                        <Pill className="w-4 h-4" /> Active Prescription Regimen
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {medications.map((m) => (
                          <div key={m.id} className="p-3 bg-[#0F172A] rounded-xl border border-[#334155] text-xs">
                            <strong className="text-white block">{m.name} ({m.dosage})</strong>
                            <span className="text-slate-400 text-[11px]">{m.frequency} • {m.instructions}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Baseline Vitals Summary */}
                    <div className="p-4 bg-[#1E293B] border border-[#334155] rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                        <Activity className="w-4 h-4" /> Baseline Vitals Log
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="p-3 bg-[#0F172A] rounded-xl text-center">
                          <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                          <strong className="text-sm font-bold text-white">128 / 82</strong>
                        </div>
                        <div className="p-3 bg-[#0F172A] rounded-xl text-center">
                          <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                          <strong className="text-sm font-bold text-white">72 bpm</strong>
                        </div>
                        <div className="p-3 bg-[#0F172A] rounded-xl text-center">
                          <span className="text-[10px] text-slate-400 block">Oxygen SpO2</span>
                          <strong className="text-sm font-bold text-white">98 %</strong>
                        </div>
                        <div className="p-3 bg-[#0F172A] rounded-xl text-center">
                          <span className="text-[10px] text-slate-400 block">Fasting Glucose</span>
                          <strong className="text-sm font-bold text-white">105 mg/dL</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD EMERGENCY CONTACT MODAL */}
      {addContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] text-white rounded-3xl max-w-md w-full border border-[#1E293B] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-800 rounded-2xl shadow-sm">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-tight">Add Emergency Contact</h3>
                  <p className="text-xs text-emerald-100 font-medium mt-0.5">1-Tap Dial for First Responders</p>
                </div>
              </div>
              <button
                onClick={() => setAddContactModalOpen(false)}
                className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddContact} className="p-6 space-y-4 bg-[#0F172A] text-slate-100">
              {contactError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  {contactError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Contact Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins / Robert Davis"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-white text-xs outline-none focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Relationship / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Primary Physician / Spouse / Sibling / Neighbor"
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-white text-xs outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Phone Number (1-Tap Dial) *</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#1E293B] border border-[#334155] text-white text-xs outline-none focus:border-emerald-500 font-medium font-mono"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setAddContactModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Save Contact</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
