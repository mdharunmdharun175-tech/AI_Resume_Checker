import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitCompare,
  ShieldAlert,
  BarChart3,
  Cpu,
  History,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentPath,
    navigate,
    userRole,
    currentUser,
    biasFlags,
    compareCandidateIds,
    logout,
    fairScreeningMode,
    isSidebarOpen,
    closeSidebar,
  } = useApp();

  const openBiasCount = biasFlags.filter((f) => f.status === 'open').length;

  // Listen to Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  const navItems = [
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['recruiter', 'hiring_manager', 'admin'] as UserRole[],
    },
    {
      id: 'nav-jobs',
      label: 'Jobs & Requirements',
      path: '/jobs',
      icon: Briefcase,
      roles: ['recruiter', 'hiring_manager', 'admin'] as UserRole[],
    },
    {
      id: 'nav-candidates',
      label: 'Candidate Ranking',
      path: '/candidates',
      icon: Users,
      roles: ['recruiter', 'hiring_manager', 'admin'] as UserRole[],
    },
    {
      id: 'nav-compare',
      label: 'Compare Candidates',
      path: '/compare',
      icon: GitCompare,
      badge: compareCandidateIds.length > 0 ? `${compareCandidateIds.length}` : undefined,
      roles: ['recruiter', 'hiring_manager', 'admin'] as UserRole[],
    },
    {
      id: 'nav-bias',
      label: 'Bias Analysis',
      path: '/bias-analysis',
      icon: ShieldAlert,
      badge: openBiasCount > 0 ? `${openBiasCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      roles: ['recruiter', 'admin'] as UserRole[],
    },
    {
      id: 'nav-analytics',
      label: 'Fairness Analytics',
      path: '/analytics',
      icon: BarChart3,
      roles: ['recruiter', 'admin'] as UserRole[],
    },
    {
      id: 'nav-model-perf',
      label: 'Model Performance',
      path: '/model-performance',
      icon: Cpu,
      roles: ['recruiter', 'admin', 'hiring_manager'] as UserRole[],
    },
    {
      id: 'nav-audit',
      label: 'Audit Logs & Trail',
      path: '/audit-logs',
      icon: History,
      roles: ['recruiter', 'admin'] as UserRole[],
    },
    {
      id: 'nav-settings',
      label: 'Scoring Settings',
      path: '/settings',
      icon: Settings,
      roles: ['recruiter', 'admin'] as UserRole[],
    },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <>
      {/* Backdrop overlay when sidebar is open */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer */}
      <aside
        id="app-navigation-drawer"
        aria-label="Navigation Menu"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-300 border-r border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Close Button */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0 bg-slate-950/60">
          <div
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">HireFair AI</span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block -mt-0.5">
                Fair Screening Platform
              </span>
            </div>
          </div>

          <button
            onClick={closeSidebar}
            title="Close menu (Esc)"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fair Mode Status indicator */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${fairScreeningMode ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-200">Fair Mode</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              fairScreeningMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {fairScreeningMode ? 'ACTIVE' : 'OFF'}
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path !== '/dashboard' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full border ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-indigo-700 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* User profile and logout */}
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/60">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 ring-2 ring-indigo-400/30">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 capitalize truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                closeSidebar();
                logout();
              }}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
