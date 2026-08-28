import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  ShieldAlert,
  BarChart3,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResumeUploaderModal } from '../components/ResumeUploaderModal';
import { Job } from '../types';

export const JobsPage: React.FC = () => {
  const { jobs, navigate, setActiveJobId } = useApp();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedJobForUpload, setSelectedJobForUpload] = useState<Job | null>(null);

  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchDept = deptFilter === 'all' || job.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Job Requisitions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage open roles, monitor candidate screening pipelines, and resolve wording bias.
          </p>
        </div>

        <button
          onClick={() => navigate('/jobs/create')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <input
          type="text"
          placeholder="Filter by title, department, or required skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500 w-full sm:w-80"
        />

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {job.department}
                  </span>
                  <h3
                    onClick={() => {
                      setActiveJobId(job.id);
                      navigate(`/jobs/${job.id}`);
                    }}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-2 cursor-pointer"
                  >
                    {job.title}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  {job.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {job.location}
                </span>
                <span>·</span>
                <span>{job.employmentType}</span>
                <span>·</span>
                <span>{job.experienceRequired}</span>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              {/* Skills preview */}
              <div className="mt-3 flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 4).map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                  >
                    {sk}
                  </span>
                ))}
                {job.requiredSkills.length > 4 && (
                  <span className="text-[10px] text-slate-400 self-center">
                    +{job.requiredSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer: Metrics & Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-semibold">Candidates</span>
                  <span className="text-sm font-bold text-slate-800">{job.candidateCount}</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <span className="text-[10px] text-emerald-600 block font-semibold">Avg Match</span>
                  <span className="text-sm font-bold text-emerald-700">{job.avgMatchScore}%</span>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <span className="text-[10px] text-amber-600 block font-semibold">Bias Flags</span>
                  <span className="text-sm font-bold text-amber-800">{job.biasFlagCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedJobForUpload(job);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Upload Resumes</span>
                </button>

                <button
                  onClick={() => {
                    setActiveJobId(job.id);
                    navigate(`/jobs/${job.id}/candidates`);
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs shadow-indigo-600/20 cursor-pointer"
                >
                  <span>Screen ({job.candidateCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedJobForUpload && (
        <ResumeUploaderModal
          isOpen={true}
          onClose={() => setSelectedJobForUpload(null)}
          job={selectedJobForUpload}
        />
      )}
    </div>
  );
};
