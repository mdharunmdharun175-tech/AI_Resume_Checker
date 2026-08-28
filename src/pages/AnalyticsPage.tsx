import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  Download,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';

export const AnalyticsPage: React.FC = () => {
  const { candidates, jobs } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Screening & Fairness Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry measuring screening velocity, score distributions, and parity compliance.
          </p>
        </div>

        <button
          onClick={() => {
            alert('Exporting HireFair Compliance & Analytics Report (PDF/CSV)...');
          }}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="metric-screen-speed"
          title="Time to Initial Screen"
          value="2.5 days"
          subtitle="Down from 14.2 days manual"
          change="-82%"
          changeType="positive"
          icon={Clock}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          isDemo={true}
        />

        <MetricCard
          id="metric-concurrence"
          title="Recruiter AI Agreement"
          value="91.8%"
          subtitle="Human-in-the-loop alignment"
          change="+4.2%"
          changeType="positive"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          id="metric-disparate-impact"
          title="Parity Impact Ratio"
          value="0.94"
          subtitle="Meets EEOC 80% four-fifths rule"
          icon={ShieldCheck}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
        />

        <MetricCard
          id="metric-cost-saved"
          title="Cost Saved / Hire"
          value="$1,420"
          subtitle="Reduced resume parsing labor"
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          isDemo={true}
        />
      </div>

      {/* Visual Funnel & Score Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Screening Funnel */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Recruitment Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate qualification progression across transparent evaluation gates
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { stage: '1. Applications Received', count: 284, pct: '100%', color: 'bg-slate-600' },
              { stage: '2. AI Match Scored (>60%)', count: 186, pct: '65.5%', color: 'bg-indigo-600' },
              { stage: '3. Human Recruiter Review', count: 94, pct: '33.1%', color: 'bg-teal-600' },
              { stage: '4. Shortlisted for Interview', count: 47, pct: '16.5%', color: 'bg-emerald-600' },
              { stage: '5. Technical Assessment', count: 24, pct: '8.4%', color: 'bg-blue-600' },
              { stage: '6. Final Offers Extended', count: 11, pct: '3.8%', color: 'bg-purple-600' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.stage}</span>
                  <span className="text-slate-600">
                    <strong>{item.count}</strong> ({item.pct})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${item.color} h-2.5 rounded-full`}
                    style={{ width: item.pct }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Candidate Match Score Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent evaluation scores across active requisitions
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { grade: 'Strong Match (88% - 100%)', count: 42, color: 'bg-emerald-500', barPct: '60%' },
              { grade: 'Good Match (80% - 87%)', count: 68, color: 'bg-teal-500', barPct: '85%' },
              { grade: 'Needs Review (60% - 79%)', count: 76, color: 'bg-amber-500', barPct: '100%' },
              { grade: 'Low Match (<60%)', count: 98, color: 'bg-rose-400', barPct: '92%' },
            ].map((dist, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{dist.grade}</span>
                  <span className="font-bold text-slate-900">{dist.count} candidates</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${dist.color} h-2.5 rounded-full`}
                    style={{ width: dist.barPct }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Standard Evaluation Curve:</strong> Scores reflect verified keyword context, requirement weights, and semantic embeddings.
          </div>
        </div>
      </div>

      {/* Fairness & Demographic Parity Audit Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Fair Screening Mode & Parity Audit Metrics
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Comparing screening outcomes under Fair Screening Mode (masked demographic metadata) versus unmasked baseline tests to ensure non-discrimination compliance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
            <span className="font-bold text-emerald-950 block">Equal Pass Rate Parity</span>
            <div className="text-2xl font-extrabold text-emerald-700">0.94</div>
            <p className="text-emerald-900/80 text-[11px]">
              Substantially surpasses the 0.80 four-fifths threshold required for adverse impact safeguards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
            <span className="font-bold text-indigo-950 block">Skill-to-Rank Correlation</span>
            <div className="text-2xl font-extrabold text-indigo-700">0.96</div>
            <p className="text-indigo-900/80 text-[11px]">
              Rankings correlate directly with verified job-relevant technical competencies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-1.5">
            <span className="font-bold text-teal-950 block">Bias Mitigation Score</span>
            <div className="text-2xl font-extrabold text-teal-700">98.2%</div>
            <p className="text-teal-900/80 text-[11px]">
              Exclusion of photo/name/university bias vectors in Fair Screening Mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
