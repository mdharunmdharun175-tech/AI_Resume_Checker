import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  ShieldAlert,
  Sparkles,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  MapPin,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FairScreeningBanner } from '../components/FairScreeningBanner';
import { CandidateRankingTable } from '../components/CandidateRankingTable';
import { ResumeUploaderModal } from '../components/ResumeUploaderModal';
import { SeverityBadge, CategoryBadge } from '../components/SeverityBadge';

export const JobDetailPage: React.FC<{ jobId?: string; initialTab?: 'candidates' | 'requirements' | 'bias' }> = ({
  jobId,
  initialTab = 'candidates',
}) => {
  const { jobs, activeJobId, activeJob, candidates, screenings, biasFlags, resolveBiasFlag, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'candidates' | 'requirements' | 'bias'>(initialTab);
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState(false);

  const targetJob = jobs.find((j) => j.id === (jobId || activeJobId)) || activeJob || jobs[0];

  const jobCandidates = candidates.filter(
    (c) => c.appliedJobId === targetJob.id || c.appliedJobId === 'job-01'
  );
  const jobBiasFlags = biasFlags.filter((f) => f.jobId === targetJob.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Jobs</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {targetJob.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {targetJob.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
            <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {targetJob.department}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {targetJob.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {targetJob.experienceRequired}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              {targetJob.salaryRange}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsResumeUploadOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload & Screen Resumes</span>
          </button>
        </div>
      </div>

      {/* Fair Screening Mode Banner */}
      <FairScreeningBanner compact={true} />

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'candidates'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Candidate Rankings ({jobCandidates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'requirements'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Job Requirements & Extraction</span>
          </button>

          <button
            onClick={() => setActiveTab('bias')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bias'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Bias Analysis ({jobBiasFlags.length})</span>
            {jobBiasFlags.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {jobBiasFlags.filter((f) => f.status === 'open').length} open
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Candidates Ranking */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <CandidateRankingTable
            candidates={jobCandidates}
            job={targetJob}
            screenings={screenings}
          />
        </div>
      )}

      {/* Tab 2: Requirements */}
      {activeTab === 'requirements' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Job Description Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {targetJob.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Required Technical Skills (40% Weight)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {targetJob.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Preferred Skills (10% Bonus Weight)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {targetJob.preferredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Education Requirements
            </h4>
            <p className="text-xs text-slate-700 font-medium">
              {targetJob.educationRequirements}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {targetJob.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Bias Analysis */}
      {activeTab === 'bias' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <span className="font-bold block">Job Description NLP Bias Scan</span>
              <span>
                Found {jobBiasFlags.length} potential wording flags. Review suggestions below to ensure inclusive hiring criteria.
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              Assistive Tool
            </span>
          </div>

          {jobBiasFlags.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
              No potential wording issues detected in this job description.
            </div>
          ) : (
            <div className="space-y-3">
              {jobBiasFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{flag.issue}</span>
                      <SeverityBadge severity={flag.severity} size="sm" />
                      <CategoryBadge category={flag.category} />
                    </div>

                    <div className="flex items-center gap-2">
                      {flag.status === 'resolved' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          ✓ Resolved by {flag.resolvedBy || 'Recruiter'}
                        </span>
                      ) : (
                        <button
                          onClick={() => resolveBiasFlag(flag.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Apply Neutral Revision
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-900">
                      <span className="font-bold block text-[10px] uppercase text-rose-600 mb-1">
                        Detected Wording:
                      </span>
                      "{flag.detectedPhrase}"
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                      <span className="font-bold block text-[10px] uppercase text-emerald-600 mb-1">
                        Suggested Neutral Revision:
                      </span>
                      "{flag.suggestedRevision}"
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    <strong className="text-slate-800">Context:</strong> {flag.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resume Uploader Modal */}
      {isResumeUploadOpen && (
        <ResumeUploaderModal
          isOpen={isResumeUploadOpen}
          onClose={() => setIsResumeUploadOpen(false)}
          job={targetJob}
        />
      )}
    </div>
  );
};
