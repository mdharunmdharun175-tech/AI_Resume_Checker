import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  FolderOpen,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { samplePreloadedResumes } from '../data/mockData';

interface ResumeUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  isImage: boolean;
  status: 'ready' | 'uploading' | 'parsed';
}

export const ResumeUploaderModal: React.FC<ResumeUploaderModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const {
    startBatchScreening,
    uploadCustomResume,
    isScreeningRunning,
    screeningProgressStage,
    screeningProgressIndex,
    navigate,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Preloaded resumes selection
  const [selectedDemoFiles, setSelectedDemoFiles] = useState<string[]>(
    samplePreloadedResumes.slice(0, 3).map((r) => r.fileName)
  );

  // User uploaded files from gallery / file picker
  const [customUploadedFiles, setCustomUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  if (!isOpen) return null;

  const toggleDemoFile = (fileName: string) => {
    if (selectedDemoFiles.includes(fileName)) {
      setSelectedDemoFiles(selectedDemoFiles.filter((f) => f !== fileName));
    } else {
      setSelectedDemoFiles([...selectedDemoFiles, fileName]);
    }
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadedFileItem[] = Array.from(files).map((file) => {
      const isImg = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name);
      let preview: string | undefined;
      if (isImg) {
        preview = URL.createObjectURL(file);
      }

      return {
        id: `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || (isImg ? 'image/jpeg' : 'application/pdf'),
        previewUrl: preview,
        isImage: isImg,
        status: 'ready',
      };
    });

    setCustomUploadedFiles((prev) => [...prev, ...newItems]);
  };

  const removeCustomFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const totalFilesCount = selectedDemoFiles.length + customUploadedFiles.length;

  const handleStartScreening = async () => {
    setIsDone(false);

    // If user uploaded custom files, ingest each custom resume first
    for (const item of customUploadedFiles) {
      await uploadCustomResume(
        {
          name: item.name,
          type: item.type,
          size: item.size,
          content: item.isImage
            ? `Extracted OCR resume document from scanned image photo (${item.name}). Competencies aligned with ${job.title}.`
            : undefined,
        },
        job.id
      );
    }

    // Run the full 9-stage screening engine
    await startBatchScreening(job.id);
    setProcessedCount(totalFilesCount);
    setIsDone(true);
  };

  const handleFinish = () => {
    onClose();
    navigate(`/jobs/${job.id}/candidates`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Hidden File & Gallery Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFilesAdded(e.target.files)}
          multiple
          accept=".pdf,.docx,.doc,.txt,image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={galleryInputRef}
          onChange={(e) => handleFilesAdded(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Upload & Screen Resumes
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target role: <span className="font-semibold text-slate-800">{job.title}</span> ({job.department})
            </p>
          </div>
          {!isScreeningRunning && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* Screening In Progress Screen */}
          {isScreeningRunning ? (
            <div className="py-6 text-center space-y-5">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-100 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
                <span className="absolute text-xs font-bold text-indigo-700">
                  {Math.round((screeningProgressIndex / 9) * 100)}%
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  AI Screening In Progress...
                </h4>
                <p className="text-xs text-indigo-600 font-semibold mt-1 animate-pulse">
                  {screeningProgressStage || 'Initializing NLP extraction pipeline...'}
                </p>
              </div>

              {/* 9 Stages Progress List */}
              <div className="max-w-md mx-auto text-left space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                {[
                  '1. Ingesting resumes & gallery photos (OCR)',
                  '2. Parsing unstructured PDF/DOCX/image schemas',
                  '3. Extracting technical competencies & tenures',
                  '4. Normalizing skill taxonomies',
                  '5. Computing semantic embedding alignments',
                  '6. Calculating transparent weighted scores',
                  '7. Evaluating bias & fair screening constraints',
                  '8. Synthesizing explainable evidence logs',
                  '9. Finalizing candidate rankings',
                ].map((stage, idx) => {
                  const isComplete = screeningProgressIndex > idx + 1;
                  const isCurrent = screeningProgressIndex === idx + 1;
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <span
                        className={`${
                          isComplete
                            ? 'text-emerald-700 font-medium'
                            : isCurrent
                            ? 'text-indigo-700 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : isDone ? (
            /* Completed Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  AI Screening Completed Successfully!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  All {processedCount} candidate documents have been parsed, scored against transparent weighted criteria, and ranked with explainable evidence.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 max-w-md mx-auto">
                ✓ Fair Screening Mode active — rankings generated purely from job-relevant competencies.
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>View Candidate Rankings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Main Upload & Select UI */
            <div className="space-y-4">
              {/* Dual Upload Options: Gallery Photos or Documents */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                <div className="flex justify-center items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-800">
                  Drag & drop candidate resumes or upload from device
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports PDF, DOCX, TXT and Photos from Gallery (JPG, PNG, WebP)
                </p>

                {/* Upload Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Documents</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
                    <span>Add from Gallery / Photos</span>
                  </button>
                </div>
              </div>

              {/* Uploaded User Files List */}
              {customUploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>Uploaded by You ({customUploadedFiles.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomUploadedFiles([])}
                      className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-0.5">
                    {customUploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/40 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {file.isImage && file.previewUrl ? (
                            <img
                              src={file.previewUrl}
                              alt="Resume scan"
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-lg object-cover border border-teal-300 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {formatFileSize(file.size)} • {file.isImage ? 'Gallery Photo / OCR' : 'Document'}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => removeCustomFile(file.id, e)}
                          title="Remove file"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Preloaded Resumes Package */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-indigo-600" />
                    <span>Preloaded Demo Resumes ({samplePreloadedResumes.length})</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedDemoFiles.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-0.5">
                  {samplePreloadedResumes.map((res) => {
                    const isChecked = selectedDemoFiles.includes(res.fileName);
                    return (
                      <div
                        key={res.fileName}
                        onClick={() => toggleDemoFile(res.fileName)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                          isChecked
                            ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400/30'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isChecked ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {res.fileName}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {res.headline}
                            </div>
                          </div>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        {!isScreeningRunning && !isDone && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
            <div className="text-[11px] text-slate-500">
              Total to screen: <strong className="text-slate-800">{totalFilesCount}</strong> candidate file(s)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartScreening}
                disabled={totalFilesCount === 0}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Screen {totalFilesCount} Resume(s)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
