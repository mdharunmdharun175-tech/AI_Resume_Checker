import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  GitCompare,
  ShieldCheck,
  Briefcase,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CandidateRankingTable } from '../components/CandidateRankingTable';
import { FairScreeningBanner } from '../components/FairScreeningBanner';
import { ResumeUploaderModal } from '../components/ResumeUploaderModal';

export const CandidatesPage: React.FC = () => {
  const {
    candidates,
    jobs,
    activeJob,
    activeJobId,
    setActiveJobId,
    screenings,
    compareCandidateIds,
    clearCompareCandidates,
    navigate,
  } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const currentJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Candidate Pipeline & Screening
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparently scored applicants ranked by verified technical competencies and domain experience.
          </p>
        </div>

        {/* Action Controls & Job selector */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-upload-candidates-page"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resumes / Gallery</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Active Role:</span>
            <select
              value={currentJob.id}
              onChange={(e) => setActiveJobId(e.target.value)}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.candidateCount} candidates)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fair Screening Mode Banner */}
      <FairScreeningBanner compact={false} />

      {/* Candidate Ranking Table */}
      <CandidateRankingTable
        candidates={candidates}
        job={currentJob}
        screenings={screenings}
      />

      {/* Resume Upload Modal with Gallery Support */}
      <ResumeUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        job={currentJob}
      />

      {/* Floating Compare Drawer Bar if candidates are checked */}
      {compareCandidateIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <GitCompare className="w-4 h-4 text-indigo-400" />
            <span>{compareCandidateIds.length} candidate(s) selected for side-by-side comparison</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompareCandidates}
              className="px-3 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => navigate('/compare')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
