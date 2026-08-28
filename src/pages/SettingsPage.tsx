import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  ShieldCheck,
  Bell,
  User,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    userRole,
    loginAsRole,
    fairScreeningMode,
    toggleFairScreeningMode,
    resetDataToDefaults,
  } = useApp();

  const [reqSkillsWeight, setReqSkillsWeight] = useState(40);
  const [expWeight, setExpWeight] = useState(25);
  const [semanticWeight, setSemanticWeight] = useState(20);
  const [eduWeight, setEduWeight] = useState(5);
  const [prefSkillsWeight, setPrefSkillsWeight] = useState(10);
  const [isSaved, setIsSaved] = useState(false);

  const totalWeight = reqSkillsWeight + expWeight + semanticWeight + eduWeight + prefSkillsWeight;

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Settings & Algorithm Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize transparent scoring weights, fairness preferences, and simulate user permissions.
        </p>
      </div>

      {/* Role Switcher Demo Box */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Active User & Role Simulator (Hackathon Demo)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => loginAsRole('recruiter')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'recruiter'
                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs text-slate-900">Recruiter</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Sarah Jenkins (Full screening & shortlist)</div>
          </button>

          <button
            type="button"
            onClick={() => loginAsRole('hiring_manager')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'hiring_manager'
                ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs text-slate-900">Hiring Manager</div>
            <div className="text-[11px] text-slate-500 mt-0.5">David Chen (Review & compare)</div>
          </button>

          <button
            type="button"
            onClick={() => loginAsRole('admin')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'admin'
                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="font-bold text-xs text-slate-900">Administrator</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Elena Vance (System weights & audits)</div>
          </button>
        </div>
      </div>

      {/* Fair Screening Mode Default */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Fair Screening Safeguards</span>
        </h3>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900 block">
              Fair Screening Mode (Demographic Masking)
            </span>
            <p className="text-[11px] text-slate-500">
              Anonymizes names, photos, emails, phone numbers, and institution brandings to mitigate unconscious bias.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleFairScreeningMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              fairScreeningMode
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {fairScreeningMode ? 'Enabled (Active)' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Transparent Algorithm Scoring Weights */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Transparent Candidate Match Formula Weights</span>
          </h3>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            Total: {totalWeight}% {totalWeight === 100 ? '✓ Balanced' : '⚠️ Must sum to 100%'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Adjust the relative importance of resume competencies. Calculations are displayed transparently in candidate score breakdowns.
        </p>

        <form onSubmit={handleSaveWeights} className="space-y-4 pt-2">
          {/* Required Skills */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">Required Skills Weight</span>
              <span className="text-indigo-600">{reqSkillsWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={reqSkillsWeight}
              onChange={(e) => setReqSkillsWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Relevant Experience */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">Relevant Experience Weight</span>
              <span className="text-indigo-600">{expWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={expWeight}
              onChange={(e) => setExpWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Semantic Match */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">Semantic Job Alignment Weight</span>
              <span className="text-indigo-600">{semanticWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={semanticWeight}
              onChange={(e) => setSemanticWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Education */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">Job-Related Education Weight</span>
              <span className="text-indigo-600">{eduWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={eduWeight}
              onChange={(e) => setEduWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Preferred Skills */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">Preferred Skills Bonus Weight</span>
              <span className="text-indigo-600">{prefSkillsWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={prefSkillsWeight}
              onChange={(e) => setPrefSkillsWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Scoring weights updated successfully!
              </span>
            )}
            {!isSaved && <span></span>}

            <button
              type="submit"
              disabled={totalWeight !== 100}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              Save Formula Weights
            </button>
          </div>
        </form>
      </div>

      {/* Reset Mock Data */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 block">Reset Application State</span>
          <p className="text-[11px] text-slate-500">
            Restore original mock jobs, applicants, bias flags, and audit records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset all demo state to factory defaults?')) {
              resetDataToDefaults();
            }
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
