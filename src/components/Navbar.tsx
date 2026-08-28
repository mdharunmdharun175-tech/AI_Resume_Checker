import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  Shield,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  ChevronDown,
  Check,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    userRole,
    loginAsRole,
    jobs,
    activeJobId,
    setActiveJobId,
    activeJob,
    fairScreeningMode,
    toggleFairScreeningMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    navigate,
    candidates,
    resetDemoData,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const q = searchQuery.toLowerCase().trim();
  const searchResults = q
    ? {
        candidates: candidates.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.candidateCode.toLowerCase().includes(q) ||
            c.skills.some((s) => s.name.toLowerCase().includes(q))
        ),
        jobs: jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.department.toLowerCase().includes(q) ||
            j.requiredSkills.some((s) => s.toLowerCase().includes(q))
        ),
      }
    : null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile menu toggle + Job context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Active Job Context Selector */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-lg border border-slate-200">
          <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs text-slate-500 font-medium">Job Context:</span>
          <select
            value={activeJobId}
            onChange={(e) => setActiveJobId(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer pr-1"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.candidateCount} cand.)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates, jobs, skills, or #A102..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-900 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all focus:outline-hidden"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && q && searchResults && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 max-h-96 overflow-y-auto space-y-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                Candidates ({searchResults.candidates.length})
              </div>
              {searchResults.candidates.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-1">No candidates match "{q}"</p>
              ) : (
                <div className="space-y-1">
                  {searchResults.candidates.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        navigate(`/candidates/${c.id}`);
                        setIsSearchFocused(false);
                      }}
                      className="p-2 hover:bg-indigo-50/70 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-700">{c.candidateCode}</span>
                        <span className="text-slate-800 font-medium">{c.name}</span>
                        <span className="text-slate-400">· {c.currentTitle}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        View Profile →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                Jobs ({searchResults.jobs.length})
              </div>
              {searchResults.jobs.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-1">No jobs match "{q}"</p>
              ) : (
                <div className="space-y-1">
                  {searchResults.jobs.slice(0, 3).map((j) => (
                    <div
                      key={j.id}
                      onClick={() => {
                        setActiveJobId(j.id);
                        navigate(`/jobs/${j.id}`);
                        setIsSearchFocused(false);
                      }}
                      className="p-2 hover:bg-indigo-50/70 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{j.title}</div>
                        <div className="text-[11px] text-slate-500">{j.department} · {j.location}</div>
                      </div>
                      <span className="text-[11px] text-indigo-600 font-semibold">Open Job →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right: Quick actions, Fair mode pill, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fair Screening Mode Quick Toggle Button */}
        <button
          id="btn-fair-mode-toggle"
          onClick={toggleFairScreeningMode}
          title="Toggle Fair Screening Mode"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
            fairScreeningMode
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${fairScreeningMode ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="hidden md:inline">Fair Mode</span>
          <span className={`w-2 h-2 rounded-full ${fairScreeningMode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            id="btn-notifications"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) navigate(notif.link);
                        setIsNotifOpen(false);
                      }}
                      className={`p-2.5 rounded-lg transition-colors cursor-pointer text-xs ${
                        notif.read ? 'hover:bg-slate-50 opacity-75' : 'bg-indigo-50/50 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher & Profile Dropdown */}
        <div ref={userRef} className="relative">
          <button
            id="btn-user-menu"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
              {currentUser.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 capitalize">
                {currentUser.role.replace('_', ' ')}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
              <div className="pb-3 mb-2 border-b border-slate-100 px-2">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Role: {currentUser.role.toUpperCase()}
                </div>
              </div>

              {/* Role Switcher Demo Options */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                  Switch Active Role (Demo)
                </div>

                <button
                  onClick={() => {
                    loginAsRole('recruiter');
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                    userRole === 'recruiter' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Recruiter</span>
                  {userRole === 'recruiter' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>

                <button
                  onClick={() => {
                    loginAsRole('hiring_manager');
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                    userRole === 'hiring_manager' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Hiring Manager</span>
                  {userRole === 'hiring_manager' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>

                <button
                  onClick={() => {
                    loginAsRole('admin');
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                    userRole === 'admin' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Administrator</span>
                  {userRole === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    resetDemoData();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
