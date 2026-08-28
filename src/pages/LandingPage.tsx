import React from 'react';
import {
  Sparkles,
  Shield,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  Users,
  Eye,
  BarChart3,
  ArrowRight,
  ChevronRight,
  FileText,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { navigate, loginAsRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">HireFair AI</span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block -mt-1">
                Fair Screening Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => loginAsRole('recruiter')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Try Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900 to-slate-900 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Resume Screening · Candidate Ranking · Bias Detection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Smarter Screening. <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400">
              Fairer Hiring.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            HireFair AI helps recruiters analyze resumes, match job-relevant qualifications, explain candidate rankings transparently, and detect potentially biased job criteria with human-in-the-loop oversight.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => loginAsRole('recruiter')}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Recruiter Demo</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Roles & Logins</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics highlight */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/50 backdrop-blur-xs border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Explainable AI Scoring</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xs border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-indigo-400">🛡 Fair Mode</div>
              <div className="text-xs text-slate-400 mt-1">Demographic & Photo Masking</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xs border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-teal-300">4-Tier</div>
              <div className="text-xs text-slate-400 mt-1">Job Description Bias Scan</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xs border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-300">Human First</div>
              <div className="text-xs text-slate-400 mt-1">No Automated Rejections</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-800 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              End-to-End Recruitment Intelligence
            </h2>
            <h3 className="text-3xl font-bold text-white">
              How HireFair AI Works
            </h3>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              A structured 6-step workflow ensuring high predictive accuracy and strictly job-relevant candidate rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="text-base font-bold text-white">1. Create a Job & Extract Requirements</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload a Job Description (PDF/DOCX/TXT). AI automatically extracts required skills, experience ranges, and key responsibilities.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="text-base font-bold text-white">2. Job Description Bias Scan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatic NLP scan flags potentially biased phrases (age-coded, gender-skewed, or restrictive criteria) and provides neutral revisions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="text-base font-bold text-white">3. Upload Resumes & AI Screening</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Batch upload resumes. A 9-stage extraction engine parses competencies, projects, degrees, and calculates semantic relevance.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h4 className="text-base font-bold text-white">4. Transparent Candidate Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scores are calculated using transparent configurable weights: Required Skills (40%), Experience (25%), Semantic (20%), Education (5%), Preferred (10%).
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-sm">
                05
              </div>
              <h4 className="text-base font-bold text-white">5. Fair Screening Mode (Shield)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recruiters can toggle Fair Screening Mode to mask candidate names, photos, and demographic identifiers during initial ranking.
              </p>
            </div>

            {/* Step 6 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center font-bold text-sm">
                06
              </div>
              <h4 className="text-base font-bold text-white">6. Human Review & Audit Logging</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Human recruiters review explainable evidence cards, compare candidates side-by-side, record shortlisting notes, and log audit events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-12 border-t border-slate-800 px-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">HireFair AI</span>
            <span>— Smarter Screening. Fairer Hiring.</span>
          </div>
          <p className="text-slate-500 max-w-xl mx-auto">
            Designed for transparent AI recruitment, bias mitigation, and human-in-the-loop talent acquisition.
          </p>
        </div>
      </footer>
    </div>
  );
};
