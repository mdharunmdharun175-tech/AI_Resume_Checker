import React from 'react';
import { Shield, ShieldCheck, Check, X, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FairScreeningBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { fairScreeningMode, toggleFairScreeningMode } = useApp();

  if (compact) {
    return (
      <div className={`rounded-lg p-3 border transition-colors flex items-center justify-between gap-3 ${
        fairScreeningMode
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-slate-100 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-md ${fairScreeningMode ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>Fair Screening Mode: {fairScreeningMode ? 'Active' : 'Disabled'}</span>
            </div>
            <p className="text-[11px] text-slate-600 hidden sm:block">
              {fairScreeningMode
                ? 'Candidate identities & demographics masked. Ranked strictly on job-relevant requirements.'
                : 'Showing unmasked candidate profiles.'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleFairScreeningMode}
          className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all shadow-xs cursor-pointer ${
            fairScreeningMode
              ? 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
          }`}
        >
          {fairScreeningMode ? 'Disable Masking' : 'Enable Fair Mode'}
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 sm:p-5 shadow-xs transition-all ${
      fairScreeningMode
        ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-emerald-200'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl shadow-xs shrink-0 ${
            fairScreeningMode ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-slate-300 text-slate-700'
          }`}>
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                🛡 FAIR SCREENING MODE
                {fairScreeningMode && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Enforced & Active
                  </span>
                )}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {fairScreeningMode
                ? 'Fair Screening Mode is active. Candidate ranking is based strictly on verified job-relevant qualifications, technical skills, and contextual experience.'
                : 'Fair Screening Mode is turned off. Candidate profiles and demographics are visible during evaluation.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleFairScreeningMode}
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all shadow-xs cursor-pointer flex items-center gap-2 ${
              fairScreeningMode
                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-emerald-600/20'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {fairScreeningMode ? 'Fair Mode Enabled' : 'Enable Fair Mode'}
          </button>
        </div>
      </div>

      {fairScreeningMode && (
        <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
            <span className="font-bold text-emerald-900 block mb-1.5 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              Included In Transparent Ranking:
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
              <span className="flex items-center gap-1 text-emerald-800 font-medium">✓ Required technical skills</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">✓ Relevant work experience</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">✓ Job-related education</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">✓ Technical certifications</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">✓ Verified software projects</span>
              <span className="flex items-center gap-1 text-emerald-800 font-medium">✓ Semantic job relevance</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-3 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <X className="w-4 h-4 text-rose-500 stroke-[3]" />
              Excluded & Masked From Scoring:
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-500">
              <span className="flex items-center gap-1">✕ Demographic attributes</span>
              <span className="flex items-center gap-1">✕ Candidate photo / appearance</span>
              <span className="flex items-center gap-1">✕ Full home address / zip code</span>
              <span className="flex items-center gap-1">✕ Age, gender & nationality</span>
              <span className="flex items-center gap-1">✕ Unrelated personal affiliations</span>
              <span className="flex items-center gap-1">✕ Elite institution prestige</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
