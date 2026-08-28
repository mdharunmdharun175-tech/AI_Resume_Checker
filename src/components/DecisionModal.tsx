import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';
import { Candidate, Job, ScreeningResult } from '../types';
import { useApp } from '../context/AppContext';

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  job: Job;
  screening?: ScreeningResult;
  initialDecision?: 'shortlist' | 'review' | 'reject';
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  onClose,
  candidate,
  job,
  screening,
  initialDecision = 'shortlist',
}) => {
  const { shortlistCandidate, rejectCandidate, markCandidateForReview, currentUser, fairScreeningMode } = useApp();

  const [decision, setDecision] = useState<'shortlist' | 'review' | 'reject'>(initialDecision);
  const [reason, setReason] = useState(
    initialDecision === 'shortlist'
      ? 'Strong technical skill match and verified backend microservice experience.'
      : initialDecision === 'review'
      ? 'Candidate has relevant software background but needs technical assessment on specific framework alignment.'
      : 'Core required technical competencies were not identified in submitted resume.'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const displayName = fairScreeningMode ? `${candidate.candidateCode} (${candidate.currentTitle})` : `${candidate.name} (${candidate.candidateCode})`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      if (decision === 'shortlist') {
        await shortlistCandidate(candidate.id, reason, notes);
      } else if (decision === 'reject') {
        await rejectCandidate(candidate.id, reason, notes);
      } else {
        await markCandidateForReview(candidate.id, reason, notes);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Human-in-the-loop Decision
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Record Decision for {displayName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate & Job Context Banner */}
        <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-800">{job.title}</div>
            <div className="text-slate-500">Recruiter: {currentUser.name}</div>
          </div>
          {screening && (
            <div className="text-right">
              <span className="text-xs text-slate-500 block">AI Match Score:</span>
              <span className="text-sm font-bold text-emerald-700">{screening.overallScore}% ({screening.matchGrade})</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Decision selection pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Decision
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDecision('shortlist');
                  setReason('Strong technical skill match and verified backend microservice experience.');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  decision === 'shortlist'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 mb-1 ${decision === 'shortlist' ? 'text-emerald-600' : 'text-slate-400'}`} />
                Shortlist
              </button>

              <button
                type="button"
                onClick={() => {
                  setDecision('review');
                  setReason('Candidate has relevant background but needs technical assessment on framework alignment.');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  decision === 'review'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertCircle className={`w-5 h-5 mb-1 ${decision === 'review' ? 'text-amber-600' : 'text-slate-400'}`} />
                Needs Review
              </button>

              <button
                type="button"
                onClick={() => {
                  setDecision('reject');
                  setReason('Required technical competencies were not identified in submitted resume.');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  decision === 'reject'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className={`w-5 h-5 mb-1 ${decision === 'reject' ? 'text-rose-600' : 'text-slate-400'}`} />
                Reject
              </button>
            </div>
          </div>

          {/* Reason Input (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Decision Rationale / Reason <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Strong FastAPI experience and relevant database optimization projects..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
            />
          </div>

          {/* Recruiter Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Internal Recruiter Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add specific questions for the engineering interviewer..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
            />
          </div>

          {/* Audit Trail & Compliance Notice */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>This decision and timestamp will be logged into the permanent HireFair audit trail.</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs transition-all cursor-pointer ${
                decision === 'shortlist'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : decision === 'review'
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              } disabled:opacity-50`}
            >
              {isSubmitting ? 'Recording...' : `Confirm ${decision.toUpperCase()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
