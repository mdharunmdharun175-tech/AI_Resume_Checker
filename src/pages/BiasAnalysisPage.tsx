import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Info,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, CategoryBadge } from '../components/SeverityBadge';
import { BiasSeverity, BiasCategory } from '../types';

export const BiasAnalysisPage: React.FC = () => {
  const { biasFlags, resolveBiasFlag, jobs } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredFlags = biasFlags.filter((flag) => {
    if (severityFilter !== 'all' && flag.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && flag.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && flag.status !== statusFilter) return false;
    if (
      search &&
      !flag.issue.toLowerCase().includes(search.toLowerCase()) &&
      !flag.jobTitle.toLowerCase().includes(search.toLowerCase()) &&
      !flag.detectedPhrase.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openCount = biasFlags.filter((f) => f.status === 'open').length;
  const resolvedCount = biasFlags.filter((f) => f.status === 'resolved').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Bias & Fairness Monitoring
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {openCount} Active Flags
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detect and revise non-job-relevant language in job descriptions to maximize inclusive talent pools.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-bold">
            {openCount} Open Flags
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-bold">
            {resolvedCount} Resolved
          </div>
        </div>
      </div>

      {/* Assistive Notice */}
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Assistive AI Review Notice</span>
          <p className="text-indigo-900/80 leading-relaxed">
            These automated flags highlight potentially restrictive or exclusionary phrases (e.g. age-coded terms, gendered adjectives, nationality criteria) to assist hiring managers in writing clear, job-relevant postings. They do not represent legal determinations.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flags, job titles, or detected phrases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter:</span>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="age">Age-Coded</option>
            <option value="gender">Gender-Skewed</option>
            <option value="nationality">Nationality / Language</option>
            <option value="education">Education Elitism</option>
            <option value="disability">Physical / Ability</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Only</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {filteredFlags.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No bias flags match your selected filters.
          </div>
        ) : (
          filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className={`bg-white rounded-xl border p-5 shadow-xs space-y-3.5 transition-all ${
                flag.status === 'resolved'
                  ? 'border-slate-200 opacity-80'
                  : 'border-amber-200 hover:border-amber-300'
              }`}
            >
              {/* Flag Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{flag.issue}</span>
                  <SeverityBadge severity={flag.severity} size="sm" />
                  <CategoryBadge category={flag.category} />
                  <span className="text-xs text-slate-500">
                    in <strong className="text-slate-800 font-semibold">{flag.jobTitle}</strong>
                  </span>
                </div>

                <div>
                  {flag.status === 'resolved' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Resolved ({flag.resolvedBy || 'Recruiter'})
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveBiasFlag(flag.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Apply Neutral Revision</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Detected vs Suggested comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-900">
                  <span className="font-bold block text-[10px] uppercase text-rose-600 mb-1">
                    Detected Non-Job-Relevant Wording:
                  </span>
                  "{flag.detectedPhrase}"
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                  <span className="font-bold block text-[10px] uppercase text-emerald-600 mb-1">
                    Suggested Inclusive Revision:
                  </span>
                  "{flag.suggestedRevision}"
                </div>
              </div>

              {/* Explanation */}
              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong className="text-slate-800">Why this was flagged:</strong> {flag.explanation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
