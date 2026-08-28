import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { samplePreloadedResumes } from '../data/mockData';

interface ResumeUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

export const ResumeUploaderModal: React.FC<ResumeUploaderModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const { startBatchScreening, isScreeningRunning, screeningProgressStage, screeningProgressIndex, navigate } = useApp();

  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    samplePreloadedResumes.slice(0, 4).map((r) => r.fileName)
  );
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const toggleFile = (fileName: string) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter((f) => f !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleStartScreening = async () => {
    setIsDone(false);
    await startBatchScreening(job.id);
    setIsDone(true);
  };

  const handleFinish = () => {
    onClose();
    navigate(`/jobs/${job.id}/candidates`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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

        {/* Screening In Progress Screen */}
        {isScreeningRunning ? (
          <div className="py-8 text-center space-y-6">
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
                '1. Uploading candidate documents',
                '2. Parsing unstructured PDF/DOCX schemas',
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
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                AI Screening Completed Successfully!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                All {selectedFiles.length} candidate documents have been parsed, scored against transparent weighted criteria, and ranked with explainable evidence.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 max-w-md mx-auto">
              ✓ Fair Screening Mode active — rankings generated purely from job-relevant competencies.
            </div>

            <div className="pt-4">
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
          /* Upload & Select Resumes Interface */
          <div className="space-y-5 mt-4">
            {/* Drag and drop box */}
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drag and drop resumes here, or click to browse
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supported formats: PDF, DOCX, TXT (Up to 20 resumes per batch)
              </p>
            </div>

            {/* Sample Preloaded Resumes Package (For Hackathon Demonstration) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-indigo-600" />
                  Preloaded Demo Applicant Resumes ({samplePreloadedResumes.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedFiles.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                {samplePreloadedResumes.map((res) => {
                  const isChecked = selectedFiles.includes(res.fileName);
                  return (
                    <div
                      key={res.fileName}
                      onClick={() => toggleFile(res.fileName)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isChecked
                          ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isChecked ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {res.fileName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {res.headline}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                Ready to parse with AI NLP & compute semantic match scores
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartScreening}
                  disabled={selectedFiles.length === 0}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Screening ({selectedFiles.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
