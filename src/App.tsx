import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { JobCreatePage } from './pages/JobCreatePage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { CandidateComparePage } from './pages/CandidateComparePage';
import { BiasAnalysisPage } from './pages/BiasAnalysisPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentPath } = useApp();

  // Full-screen pages without sidebar/navbar
  if (currentPath === '/landing') {
    return <LandingPage />;
  }

  if (currentPath === '/login') {
    return <LoginPage />;
  }

  // Dynamic Route Matching
  const renderRoute = () => {
    // Exact routes
    if (currentPath === '/' || currentPath === '/dashboard') {
      return <DashboardPage />;
    }
    if (currentPath === '/jobs') {
      return <JobsPage />;
    }
    if (currentPath === '/jobs/create') {
      return <JobCreatePage />;
    }
    if (currentPath === '/candidates') {
      return <CandidatesPage />;
    }
    if (currentPath === '/compare') {
      return <CandidateComparePage />;
    }
    if (currentPath === '/bias-analysis') {
      return <BiasAnalysisPage />;
    }
    if (currentPath === '/analytics') {
      return <AnalyticsPage />;
    }
    if (currentPath === '/model-performance') {
      return <ModelPerformancePage />;
    }
    if (currentPath === '/audit-logs') {
      return <AuditLogsPage />;
    }
    if (currentPath === '/settings') {
      return <SettingsPage />;
    }

    // Parametric routes: /jobs/:id/candidates
    const jobCandidatesMatch = currentPath.match(/^\/jobs\/([^\/]+)\/candidates$/);
    if (jobCandidatesMatch) {
      const jobId = jobCandidatesMatch[1];
      return <JobDetailPage jobId={jobId} initialTab="candidates" />;
    }

    // Parametric routes: /jobs/:id
    const jobDetailMatch = currentPath.match(/^\/jobs\/([^\/]+)$/);
    if (jobDetailMatch) {
      const jobId = jobDetailMatch[1];
      return <JobDetailPage jobId={jobId} initialTab="candidates" />;
    }

    // Parametric routes: /candidates/:id
    const candidateDetailMatch = currentPath.match(/^\/candidates\/([^\/]+)$/);
    if (candidateDetailMatch) {
      const candidateId = candidateDetailMatch[1];
      return <CandidateDetailPage candidateId={candidateId} />;
    }

    // Fallback default
    return <DashboardPage />;
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          {renderRoute()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
