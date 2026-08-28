import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, UserCheck, Briefcase, Lock, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { loginAsRole, navigate } = useApp();
  const [email, setEmail] = useState('sarah.jenkins@hirefair.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRole('recruiter');
    await loginAsRole('recruiter');
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoadingRole(role);
    await loginAsRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => navigate('/landing')}
          className="inline-flex items-center justify-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
          HireFair AI
        </h2>
        <p className="mt-1 text-sm font-medium text-indigo-400">
          “Smarter Screening. Fairer Hiring.”
        </p>
      </div>

      {/* Main Login Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          <form className="space-y-4" onSubmit={handleStandardLogin}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!!loadingRole}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loadingRole === 'recruiter' ? 'Authenticating...' : 'Sign In with Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Login Options */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Instant Hackathon Demo Access
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('recruiter')}
                disabled={!!loadingRole}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-950/70 border border-slate-700 hover:border-indigo-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                      Recruiter Demo
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Sarah Jenkins · Full screening, bias analysis, shortlist
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('hiring_manager')}
                disabled={!!loadingRole}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-teal-300">
                      Hiring Manager Demo
                    </div>
                    <div className="text-[11px] text-slate-400">
                      David Chen · View rankings, comparisons, reviews
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={!!loadingRole}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300">
                      Administrator Demo
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Elena Vance · System weights, model metrics, audit logs
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
