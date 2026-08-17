import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ChevronRight,
  ShieldAlert,
  BarChart2,
  RefreshCw,
  X,
  File,
  Image as ImageIcon,
  AlignLeft,
  Type as TypeIcon,
  FileType,
} from 'lucide-react';
import { MedicalReport, ReportParameter } from '../../types';

export const ReportAnalyzerView: React.FC = () => {
  const { reports, addReport, t } = useApp();
  const [selectedReport, setSelectedReport] = useState<MedicalReport>(reports[0]);
  
  // Upload State
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [reportTypeSelect, setReportTypeSelect] = useState<'CBC' | 'Lipid Profile' | 'Blood Glucose' | 'Thyroid' | 'Liver Function' | 'Kidney Function' | 'Other'>('CBC');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (!customTitle) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setCustomTitle(nameWithoutExt);
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleSampleInsert = (sampleType: 'cbc' | 'lipid' | 'sugar' | 'thyroid') => {
    setInputMode('text');
    switch (sampleType) {
      case 'cbc':
        setReportTypeSelect('CBC');
        setCustomTitle('Complete Blood Count Sample');
        setRawText(
          `PATIENT LAB REPORT - COMPLETE BLOOD COUNT (CBC)\n--------------------------------------------\nHemoglobin: 11.8 g/dL (Reference Range: 13.5 - 17.5)\nWBC (White Blood Cell Count): 10.5 K/uL (Reference Range: 4.5 - 11.0)\nPlatelet Count: 210 K/uL (Reference Range: 150 - 450)\nRBC (Red Blood Cell Count): 4.1 M/uL (Reference Range: 4.3 - 5.9)\nHematocrit (HCT): 36.5 % (Reference Range: 38.8 - 50.0)\nNeutrophils: 65 % (Reference Range: 40 - 70)`
        );
        break;
      case 'lipid':
        setReportTypeSelect('Lipid Profile');
        setCustomTitle('Lipid Panel Lab Report');
        setRawText(
          `LIPID PROFILE PANEL LAB RESULTS\n--------------------------------------------\nTotal Cholesterol: 235 mg/dL (Reference: Desirable < 200)\nHDL Cholesterol (Good): 48 mg/dL (Reference: > 40)\nLDL Cholesterol (Bad): 158 mg/dL (Reference: Optimal < 100)\nTriglycerides: 142 mg/dL (Reference: Normal < 150)\nVLDL Cholesterol: 28 mg/dL (Reference: 5 - 40)`
        );
        break;
      case 'sugar':
        setReportTypeSelect('Blood Glucose');
        setCustomTitle('Glycemic & HbA1c Report');
        setRawText(
          `BLOOD GLUCOSE & HBA1C TEST REPORT\n--------------------------------------------\nFasting Blood Glucose: 112 mg/dL (Reference Range: 70 - 99 mg/dL)\nHbA1c (Glycated Hemoglobin): 6.2 % (Reference: Normal < 5.7%, Prediabetes 5.7-6.4%)\nPost-Prandial Blood Sugar: 165 mg/dL (Reference: < 140 mg/dL)`
        );
        break;
      case 'thyroid':
        setReportTypeSelect('Thyroid');
        setCustomTitle('Thyroid Function Test');
        setRawText(
          `THYROID FUNCTION PANEL (TFT)\n--------------------------------------------\nTSH (Thyroid Stimulating Hormone): 5.2 uIU/mL (Reference: 0.4 - 4.0 uIU/mL)\nFree T3 (Triiodothyronine): 3.1 pg/mL (Reference: 2.3 - 4.2 pg/mL)\nFree T4 (Thyroxine): 1.1 ng/dL (Reference: 0.8 - 1.8 ng/dL)`
        );
        break;
    }
  };

  const handleAnalyzeReport = async () => {
    if (inputMode === 'file' && !selectedFile) return;
    if (inputMode === 'text' && !rawText.trim()) return;

    setIsUploading(true);
    setUploadStep('Reading document data...');

    let fileBase64 = '';
    let mimeType = '';

    try {
      if (inputMode === 'file' && selectedFile) {
        setUploadStep('Converting PDF/Image file for AI vision analysis...');
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const commaIdx = result.indexOf(',');
            resolve(commaIdx !== -1 ? result.substring(commaIdx + 1) : result);
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(selectedFile);
        });
        fileBase64 = base64Data;
        mimeType = selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png');
      }

      setUploadStep('Analyzing parameters with Aura AI...');

      const response = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: reportTypeSelect,
          reportText: rawText,
          fileBase64,
          mimeType,
          fileName: selectedFile?.name || 'Text Report',
        }),
      });

      const data = await response.json();
      if (data.success && data.report) {
        const titleText = customTitle.trim() || `${reportTypeSelect} Report`;
        const newRep: MedicalReport = {
          id: `rep_${Date.now()}`,
          title: titleText,
          reportType: reportTypeSelect,
          date: new Date().toISOString().split('T')[0],
          fileName: selectedFile?.name,
          status: data.report.parameters.some((p: any) => p.status === 'high' || p.status === 'low' || p.status === 'attention')
            ? 'attention'
            : 'completed',
          summary: data.report.summary,
          simpleExplanation: data.report.simpleExplanation,
          parameters: data.report.parameters,
          observations: data.report.observations || [],
          questionsForDoctor: data.report.questionsForDoctor || [],
        };
        addReport(newRep);
        setSelectedReport(newRep);

        // Reset form state
        setSelectedFile(null);
        setFilePreview(null);
        setRawText('');
        setCustomTitle('');
      }
    } catch (err) {
      console.error('Failed to analyze report:', err);
    } finally {
      setIsUploading(false);
      setUploadStep('');
    }
  };

  const getStatusBadge = (status: ReportParameter['status']) => {
    switch (status) {
      case 'normal':
        return (
          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#00ffa3]/10 border border-[#00ffa3]/30 text-[#00ffa3] font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> NORMAL
          </span>
        );
      case 'high':
        return (
          <span className="font-mono text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> HIGH
          </span>
        );
      case 'low':
        return (
          <span className="font-mono text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> LOW
          </span>
        );
      case 'attention':
        return (
          <span className="font-mono text-[10px] px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> ATTENTION
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b-2 border-[#e2e4e9] pb-6 pt-2">
        <div className="md:col-span-2 space-y-1">
          <div className="label-meta flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse"></span>
            AI Clinical Parser • Vision & Language Active
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Medical Report Analyzer
          </h2>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <p className="label-meta text-slate-400 max-w-xs md:text-right leading-relaxed">
            Upload PDF scans, images, or paste raw lab test text for instant plain-language AI parameter extraction.
          </p>
        </div>
      </div>

      {/* Upload & Analyze Card */}
      <div className="bg-[#141619] p-6 border border-[#1e2229] relative space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2229]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#00ffa3] text-black font-extrabold flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">Upload New Medical Report</h3>
              <span className="label-meta text-[10px] text-slate-400">PDF • IMAGE (PNG/JPG) • RAW TEXT</span>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#0b0c0d] p-1 border border-[#1e2229] rounded">
            <button
              onClick={() => setInputMode('file')}
              className={`px-3 py-1.5 font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                inputMode === 'file' ? 'bg-[#00ffa3] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileType className="w-3.5 h-3.5" />
              <span>PDF / Image</span>
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-3 py-1.5 font-mono text-xs font-bold flex items-center gap-2 transition-all ${
                inputMode === 'text' ? 'bg-[#00ffa3] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Paste / Type Text</span>
            </button>
          </div>
        </div>

        {/* Category & Title Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label-meta text-[10px]">Report Category</label>
            <select
              value={reportTypeSelect}
              onChange={(e) => setReportTypeSelect(e.target.value as any)}
              className="w-full p-3 bg-[#0b0c0d] border border-[#1e2229] text-[#00ffa3] font-mono text-xs font-bold outline-none cursor-pointer focus:border-[#00ffa3]"
            >
              <option value="CBC">Complete Blood Count (CBC)</option>
              <option value="Lipid Profile">Lipid Profile Panel</option>
              <option value="Blood Glucose">Blood Glucose & HbA1c</option>
              <option value="Thyroid">Thyroid Function (TSH, T3, T4)</option>
              <option value="Liver Function">Liver Function Test (LFT)</option>
              <option value="Kidney Function">Renal / Kidney Panel</option>
              <option value="Other">General Lab / Pathology</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="label-meta text-[10px]">Report Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Annual Blood Checkup - Aug 2026"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full p-3 bg-[#0b0c0d] border border-[#1e2229] text-white font-mono text-xs outline-none focus:border-[#00ffa3]"
            />
          </div>
        </div>

        {/* MODE 1: FILE UPLOAD (PDF / IMAGE) */}
        {inputMode === 'file' && (
          <div className="space-y-4">
            {!selectedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  dragActive
                    ? 'border-[#00ffa3] bg-[#0d2e22]/40'
                    : 'border-[#1e2229] bg-[#0b0c0d] hover:border-[#00ffa3]/50'
                }`}
              >
                <label className="flex flex-col items-center gap-3 cursor-pointer w-full">
                  <div className="w-12 h-12 rounded bg-[#0d2e22] text-[#00ffa3] border border-[#00ffa3]/30 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-base text-white block">
                      Drag & Drop Medical File Here
                    </span>
                    <span className="label-meta text-[11px] text-slate-400 block mt-1">
                      Supports PDF (.pdf), Images (.png, .jpg, .jpeg, .webp)
                    </span>
                  </div>

                  <span className="mt-2 px-4 py-2 bg-[#1e2229] hover:bg-[#2d323a] text-[#00ffa3] font-mono font-bold text-xs uppercase transition-colors">
                    Browse Computer Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
            ) : (
              /* Selected File Preview Card */
              <div className="p-4 bg-[#0b0c0d] border border-[#00ffa3]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Report preview"
                      className="w-16 h-16 object-cover rounded border border-[#1e2229] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#0d2e22] border border-[#00ffa3]/40 flex flex-col items-center justify-center text-[#00ffa3] shrink-0">
                      <FileText className="w-6 h-6" />
                      <span className="font-mono text-[8px] font-bold mt-1">PDF</span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <span className="font-display font-bold text-sm text-white truncate block">
                      {selectedFile.name}
                    </span>
                    <span className="label-meta text-[10px] text-slate-400 block">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'PDF Document'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-2 bg-rose-950/40 border border-rose-800 hover:bg-rose-900 text-rose-400 transition-colors text-xs font-mono font-bold flex items-center gap-1 shrink-0"
                >
                  <X className="w-4 h-4" />
                  <span>Remove File</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: PASTE / TYPE RAW TEXT */}
        {inputMode === 'text' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="label-meta text-[10px]">
                Paste Raw Clinical Text or Lab Report Values
              </label>

              {/* Sample Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="label-meta text-[9px] text-slate-500">Insert Quick Sample:</span>
                <button
                  type="button"
                  onClick={() => handleSampleInsert('cbc')}
                  className="px-2 py-0.5 bg-[#0b0c0d] hover:bg-[#1e2229] border border-[#1e2229] text-[#00ffa3] font-mono text-[10px]"
                >
                  CBC
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleInsert('lipid')}
                  className="px-2 py-0.5 bg-[#0b0c0d] hover:bg-[#1e2229] border border-[#1e2229] text-[#00ffa3] font-mono text-[10px]"
                >
                  Lipid Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleInsert('sugar')}
                  className="px-2 py-0.5 bg-[#0b0c0d] hover:bg-[#1e2229] border border-[#1e2229] text-[#00ffa3] font-mono text-[10px]"
                >
                  Blood Sugar
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleInsert('thyroid')}
                  className="px-2 py-0.5 bg-[#0b0c0d] hover:bg-[#1e2229] border border-[#1e2229] text-[#00ffa3] font-mono text-[10px]"
                >
                  Thyroid
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Paste clinical lab report content or parameters here...\n\nExample:\nHemoglobin: 11.8 g/dL (Ref: 13.5 - 17.5)\nTotal Cholesterol: 235 mg/dL (Ref: < 200)\nTSH: 5.2 uIU/mL (Ref: 0.4 - 4.0)\nFasting Blood Sugar: 112 mg/dL`}
              className="w-full p-4 bg-[#0b0c0d] border border-[#1e2229] text-white font-mono text-xs outline-none focus:border-[#00ffa3] transition-colors leading-relaxed"
            />
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>{rawText.length} characters</span>
              {rawText && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="hover:text-slate-300 underline"
                >
                  Clear Text
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Button & Processing State */}
        <div className="pt-2">
          {isUploading ? (
            <div className="p-4 bg-[#0b0c0d] border border-[#00ffa3] flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 text-[#00ffa3] animate-spin" />
              <span className="font-mono text-xs font-bold text-[#00ffa3]">
                {uploadStep || 'Analyzing Report Parameters...'}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAnalyzeReport}
              disabled={inputMode === 'file' ? !selectedFile : !rawText.trim()}
              className={`w-full py-3.5 px-6 font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                (inputMode === 'file' && selectedFile) || (inputMode === 'text' && rawText.trim())
                  ? 'bg-[#00ffa3] hover:bg-[#00ffa3]/90 text-black shadow-lg cursor-pointer'
                  : 'bg-[#1e2229] text-slate-500 cursor-not-allowed border border-[#1e2229]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Report with Aura AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Analyzed Reports History & Active Detailed Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports History List */}
        <div className="bg-[#141619] p-6 border border-[#1e2229] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2229] pb-3">
            <h3 className="font-display font-extrabold text-lg text-white">Processed Reports</h3>
            <span className="label-meta text-[#00ffa3]">{reports.length} LABS</span>
          </div>

          <div className="space-y-2">
            {reports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`w-full p-4 text-left border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#0b0c0d] border-[#00ffa3] text-white'
                      : 'bg-[#0b0c0d] border-[#1e2229] hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 shrink-0 ${isSelected ? 'bg-[#0d2e22] text-[#00ffa3]' : 'bg-[#1e2229] text-slate-400'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold block truncate text-white">{rep.title}</span>
                      <span className="label-meta text-[10px] text-slate-400 block">{rep.date} • {rep.reportType}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#00ffa3]' : 'text-slate-500 group-hover:text-white'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Report Details */}
        {selectedReport && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#141619] p-6 border border-[#1e2229] space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e2229] pb-4">
                <div>
                  <span className="label-meta text-[10px] text-[#00ffa3] font-bold block">
                    {selectedReport.reportType} REPORT
                  </span>
                  <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">{selectedReport.title}</h2>
                  <span className="label-meta text-[10px] text-slate-400">Processed on {selectedReport.date}</span>
                </div>

                <div>{getStatusBadge(selectedReport.status as any)}</div>
              </div>

              {/* Plain Language Clinical Explanation */}
              <div className="p-4 bg-[#0b0c0d] border-l-2 border-[#00ffa3] border-y border-r border-[#1e2229] space-y-1.5">
                <div className="flex items-center gap-2 text-[#00ffa3] font-mono font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Plain Language Clinical Explanation</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedReport.simpleExplanation}
                </p>
              </div>

              {/* Extracted Parameters Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1e2229] pb-2">
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#00ffa3]" />
                    <span>Extracted Clinical Parameters</span>
                  </h3>
                  <span className="label-meta text-[10px] text-slate-400">
                    {selectedReport.parameters.length} METRICS
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedReport.parameters.map((param, i) => {
                    const totalRange = (param.referenceHigh || 100) * 1.3;
                    const valPercent = Math.min(100, Math.max(8, (param.value / (totalRange || 1)) * 100));
                    const lowPercent = ((param.referenceLow || 0) / (totalRange || 1)) * 100;
                    const highPercent = ((param.referenceHigh || 100) / (totalRange || 1)) * 100;

                    return (
                      <div
                        key={i}
                        className="p-4 bg-[#0b0c0d] border border-[#1e2229] space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-mono text-xs font-bold text-white block">{param.name}</span>
                            <span className="text-[11px] text-slate-400 font-sans">{param.explanation}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <strong className="font-mono text-base font-extrabold text-white">
                              {param.value} <span className="text-xs font-normal text-slate-400">{param.unit}</span>
                            </strong>
                            {getStatusBadge(param.status)}
                          </div>
                        </div>

                        {/* Reference Range Bar */}
                        <div className="pt-2 border-t border-[#1e2229]/60">
                          <div className="flex justify-between label-meta text-[9px] mb-1">
                            <span>MIN REF: {param.referenceLow} {param.unit}</span>
                            <span>MAX REF: {param.referenceHigh} {param.unit}</span>
                          </div>
                          <div className="relative w-full h-2 bg-[#1e2229] overflow-hidden">
                            <div
                              className="absolute top-0 bottom-0 bg-[#00ffa3]/30"
                              style={{ left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }}
                            />
                            <div
                              className={`absolute top-0 bottom-0 w-2 transform -translate-x-1/2 ${
                                param.status === 'normal' ? 'bg-[#00ffa3]' : 'bg-amber-400'
                              }`}
                              style={{ left: `${valPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Questions for Doctor */}
              {selectedReport.questionsForDoctor && selectedReport.questionsForDoctor.length > 0 && (
                <div className="p-4 bg-[#0b0c0d] border border-[#1e2229] space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-mono font-bold text-xs uppercase">
                    <HelpCircle className="w-4 h-4" />
                    <span>Suggested Questions for Your Doctor</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 font-sans pl-1">
                    {selectedReport.questionsForDoctor.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Non-Diagnostic Disclaimer */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-200 font-mono leading-relaxed">
                  {t.disclaimer}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
