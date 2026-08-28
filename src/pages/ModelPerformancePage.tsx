import React from 'react';
import {
  BrainCircuit,
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';

export const ModelPerformancePage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              AI Model Performance & Evaluation
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              v3.4 Production Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Telemetry evaluating NLP resume extraction accuracy, human-AI alignment, and fairness metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Last evaluated: 2 hours ago</span>
          <button
            onClick={() => alert('Triggering validation suite...')}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Benchmark</span>
          </button>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          id="metric-nlp-accuracy"
          title="Skill Extraction Accuracy"
          value="95.4%"
          subtitle="Verified against manual benchmark"
          change="+1.2%"
          changeType="positive"
          icon={BrainCircuit}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <MetricCard
          id="metric-recruiter-agreement"
          title="Recruiter Agreement Rate"
          value="91.8%"
          subtitle="Human shortlist concurrence"
          change="+0.8%"
          changeType="positive"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          id="metric-false-reject"
          title="False Negative Rate"
          value="1.9%"
          subtitle="Qualified applicants missed"
          change="-0.4%"
          changeType="positive"
          icon={AlertCircle}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
        />

        <MetricCard
          id="metric-latency"
          title="Median Screen Latency"
          value="1.2s"
          subtitle="Per resume (PDF/DOCX)"
          icon={Cpu}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Model Benchmark Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification & Extraction Metrics */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            NLP Extraction & Semantic Accuracy
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">Precision (Relevant skills identified):</span>
              <span className="font-bold text-emerald-700">96.2%</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">Recall (Total required skills captured):</span>
              <span className="font-bold text-indigo-700">94.7%</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">F1 Score (Balanced harmonic mean):</span>
              <span className="font-bold text-teal-700">95.4%</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">Semantic Embedding Cosine Distance:</span>
              <span className="font-bold text-slate-900">0.89 Avg Alignment</span>
            </div>
          </div>
        </div>

        {/* Fairness & Model Drift Safeguards */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Fairness & Drift Monitoring
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200">
              <span className="font-semibold text-emerald-950">Demographic Independence (Fair Mode):</span>
              <span className="font-bold text-emerald-700">99.8% Exclusion</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-200">
              <span className="font-semibold text-indigo-950">Disparate Impact Ratio (EEOC 80% Rule):</span>
              <span className="font-bold text-indigo-700">0.94 Compliant</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">Model Concept Drift Index:</span>
              <span className="font-bold text-slate-800">0.02 (Minimal drift)</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">Human Override Rate:</span>
              <span className="font-bold text-amber-700">8.2% (Reviewed & Logged)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Human in the loop commitment */}
      <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-5 h-5" />
          <span>Human-in-the-Loop AI Governance</span>
        </div>
        <p className="text-slate-300 leading-relaxed max-w-4xl">
          HireFair AI explicitly mandates human verification for all shortlisting and rejection decisions. Model weights, criteria checklists, and semantic scoring rationale are transparently exposed in every candidate profile to prevent automated black-box bias.
        </p>
      </div>
    </div>
  );
};
