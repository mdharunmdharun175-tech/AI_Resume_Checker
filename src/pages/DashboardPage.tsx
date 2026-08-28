import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  UserCheck,
  ShieldAlert,
  BarChart3,
  Clock,
  Sparkles,
  Plus,
  Upload,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { FairScreeningBanner } from '../components/FairScreeningBanner';
import { ResumeUploaderModal } from '../components/ResumeUploaderModal';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    userRole,
    jobs,
    activeJob,
    setActiveJobId,
    candidates,
    biasFlags,
    decisions,
    navigate,
    fairScreeningMode,
  } = useApp();

  const [isResumeUploadModalOpen, setIsResumeUploadModalOpen] = useState(false);

  const openBiasCount = biasFlags.filter((f) => f.status === 'open').length;
  const shortlistedCount = candidates.filter((c) => c.status === 'shortlisted').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here’s a transparent overview of your active recruitment pipeline and candidate screenings.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => navigate('/jobs/create')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job</span>
          </button>

          <button
            onClick={() => setIsResumeUploadModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Upload Resumes</span>
          </button>

          <button
            onClick={() => navigate('/compare')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <GitCompare className="w-4 h-4 text-slate-600" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Fair Screening Mode Banner */}
      <FairScreeningBanner />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          id="metric-active-jobs"
          title="Active Jobs"
          value={jobs.length}
          subtitle="All departments"
          icon={Briefcase}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          onClick={() => navigate('/jobs')}
        />

        <MetricCard
          id="metric-total-candidates"
          title="Total Candidates"
          value="284"
          subtitle="14 in active job"
          change="+18%"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          isDemo={true}
          onClick={() => navigate('/candidates')}
        />

        <MetricCard
          id="metric-shortlisted"
          title="Shortlisted"
          value="47"
          subtitle={`${shortlistedCount} in demo batch`}
          change="+12%"
          icon={UserCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          isDemo={true}
          onClick={() => navigate('/candidates')}
        />

        <MetricCard
          id="metric-bias-flags"
          title="Bias Flags"
          value={openBiasCount}
          subtitle="4 high severity"
          change="-25%"
          changeType="positive"
          icon={ShieldAlert}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          onClick={() => navigate('/bias-analysis')}
        />

        <MetricCard
          id="metric-avg-match"
          title="Avg Match Score"
          value="82%"
          subtitle="Across active roles"
          icon={BarChart3}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          onClick={() => navigate('/analytics')}
        />

        <MetricCard
          id="metric-time-saved"
          title="Screening Time"
          value="74 hrs"
          subtitle="Saved this month"
          icon={Clock}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          isDemo={true}
        />
      </div>

      {/* Recruitment Visual Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Recruitment Screening Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate progression across transparent screening and human review gates
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer" onClick={() => navigate('/analytics')}>
            Detailed Funnel →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { stage: '1. Applied', count: 124, color: 'border-slate-200 bg-slate-50 text-slate-800' },
            { stage: '2. AI Screening', count: 68, color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900' },
            { stage: '3. Human Review', count: 45, color: 'border-amber-200 bg-amber-50/50 text-amber-900' },
            { stage: '4. Shortlisted', count: 47, color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900' },
            { stage: '5. Interview', count: 24, color: 'border-blue-200 bg-blue-50/50 text-blue-900' },
            { stage: '6. Selected', count: 11, color: 'border-teal-200 bg-teal-50/50 text-teal-900' },
          ].map((step, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${step.color} text-center space-y-1`}>
              <div className="text-[11px] font-semibold opacity-75">{step.stage}</div>
              <div className="text-xl font-bold">{step.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Jobs & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Jobs Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Active Job Requisitions ({jobs.length})
            </h2>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              View All Jobs →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Job Vacancy</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-center">Candidates</th>
                  <th className="py-2.5 px-3 text-center">Avg Match</th>
                  <th className="py-2.5 px-3 text-center">Bias Flags</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div
                        onClick={() => {
                          setActiveJobId(job.id);
                          navigate(`/jobs/${job.id}`);
                        }}
                        className="cursor-pointer group"
                      >
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-slate-500">{job.location}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {job.department}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {job.candidateCount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {job.avgMatchScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {job.biasFlagCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {job.biasFlagCount} flags
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveJobId(job.id);
                            navigate(`/jobs/${job.id}/candidates`);
                          }}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md transition-colors cursor-pointer text-xs"
                        >
                          Candidates
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Top Bias Alerts & Decisions */}
        <div className="space-y-6">
          {/* Bias Alert Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Bias Alerts for Review</span>
              </div>
              <button
                onClick={() => navigate('/bias-analysis')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 cursor-pointer"
              >
                Resolve →
              </button>
            </div>

            <div className="space-y-2.5">
              {biasFlags.slice(0, 3).map((flag) => (
                <div
                  key={flag.id}
                  onClick={() => navigate('/bias-analysis')}
                  className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/70 hover:bg-amber-50 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">{flag.issue}</span>
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      {flag.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                    "{flag.detectedPhrase}"
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1">{flag.jobTitle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Decisions Activity Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Recent Human Decisions
              </span>
              <button
                onClick={() => navigate('/audit-logs')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 cursor-pointer"
              >
                Audit Log →
              </button>
            </div>

            <div className="space-y-2">
              {decisions.slice(0, 3).map((dec) => (
                <div key={dec.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {dec.candidateCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dec.decision === 'shortlist'
                          ? 'bg-emerald-100 text-emerald-800'
                          : dec.decision === 'review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {dec.decision.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{dec.reason}</p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    By {dec.recruiterName} · Match Score {dec.aiSuggestedMatch}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Uploader Modal */}
      {isResumeUploadModalOpen && (
        <ResumeUploaderModal
          isOpen={isResumeUploadModalOpen}
          onClose={() => setIsResumeUploadModalOpen(false)}
          job={activeJob || jobs[0]}
        />
      )}
    </div>
  );
};
