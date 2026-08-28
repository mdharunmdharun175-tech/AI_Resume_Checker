import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  Job,
  Candidate,
  ScreeningResult,
  BiasFlag,
  RecruiterDecision,
  AuditEvent,
  AppNotification,
  AppSettings,
  ScreeningWeights,
} from '../types';
import { HireFairStore } from '../services/apiClient';
import { authService } from '../services/authService';
import { jobService } from '../services/jobService';
import { candidateService } from '../services/candidateService';
import { screeningService } from '../services/screeningService';
import { biasService } from '../services/biasService';
import { auditService } from '../services/auditService';
import { notificationService } from '../services/notificationService';
import { AiService } from '../services/aiService';

interface AppContextType {
  currentUser: User;
  userRole: UserRole;
  jobs: Job[];
  activeJobId: string;
  activeJob: Job | undefined;
  candidates: Candidate[];
  screenings: Record<string, ScreeningResult>;
  biasFlags: BiasFlag[];
  decisions: RecruiterDecision[];
  auditLogs: AuditEvent[];
  notifications: AppNotification[];
  settings: AppSettings;
  fairScreeningMode: boolean;
  searchQuery: string;
  currentPath: string;
  compareCandidateIds: string[];
  isScreeningRunning: boolean;
  screeningProgressStage: string;
  screeningProgressIndex: number;
  isSidebarOpen: boolean;
  
  // Navigation & Search
  navigate: (path: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveJobId: (id: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  closeSidebar: () => void;
  
  // Auth
  loginAsRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  
  // Core Actions
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'candidateCount' | 'biasFlagCount' | 'avgMatchScore'>) => Promise<Job>;
  startBatchScreening: (jobId: string, candidateIds?: string[]) => Promise<void>;
  uploadCustomResume: (file: { name: string; type: string; size: number; content?: string }, jobId: string) => Promise<Candidate>;
  shortlistCandidate: (candidateId: string, reason: string, notes?: string) => Promise<void>;
  rejectCandidate: (candidateId: string, reason: string, notes?: string) => Promise<void>;
  markCandidateForReview: (candidateId: string, reason: string, notes?: string) => Promise<void>;
  resolveBiasFlag: (flagId: string) => Promise<void>;
  toggleFairScreeningMode: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetDemoData: () => void;
  
  // Candidate Comparison
  toggleCompareCandidate: (candidateId: string) => void;
  clearComparison: () => void;
  
  // Notification
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(HireFairStore.getCurrentUser());
  const [jobs, setJobs] = useState<Job[]>(HireFairStore.getJobs());
  const [activeJobId, setActiveJobId] = useState<string>('job-01');
  const [candidates, setCandidates] = useState<Candidate[]>(HireFairStore.getCandidates());
  const [screenings, setScreenings] = useState<Record<string, ScreeningResult>>(HireFairStore.getScreenings());
  const [biasFlags, setBiasFlags] = useState<BiasFlag[]>(HireFairStore.getBiasFlags());
  const [decisions, setDecisions] = useState<RecruiterDecision[]>(HireFairStore.getDecisions());
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(HireFairStore.getAuditLogs());
  const [notifications, setNotifications] = useState<AppNotification[]>(HireFairStore.getNotifications());
  const [settings, setSettings] = useState<AppSettings>(HireFairStore.getSettings());
  const [fairScreeningMode, setFairScreeningMode] = useState<boolean>(HireFairStore.getSettings().fairScreeningDefault);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [compareCandidateIds, setCompareCandidateIds] = useState<string[]>(['cand-01', 'cand-02']);
  const [isScreeningRunning, setIsScreeningRunning] = useState<boolean>(false);
  const [screeningProgressStage, setScreeningProgressStage] = useState<string>('');
  const [screeningProgressIndex, setScreeningProgressIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpen(open);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loginAsRole = async (role: UserRole) => {
    const user = await authService.loginDemo(role);
    setCurrentUser(user);
    await auditService.logEvent(
      'User Logged In',
      'auth',
      user.id,
      `User ${user.name} authenticated into HireFair AI as role: ${role.toUpperCase()}`
    );
    setAuditLogs(HireFairStore.getAuditLogs());
    navigate('/dashboard');
  };

  const logout = () => {
    navigate('/login');
  };

  const toggleFairScreeningMode = () => {
    const newVal = !fairScreeningMode;
    setFairScreeningMode(newVal);
    auditService.logEvent(
      newVal ? 'Fair Screening Mode Enabled' : 'Fair Screening Mode Disabled',
      'settings',
      'fair-mode-toggle',
      newVal
        ? 'Activated Fair Screening Mode: Masking demographic identifiers, photographs, and personal addresses during ranking.'
        : 'Deactivated Fair Screening Mode.'
    ).then(() => {
      setAuditLogs(HireFairStore.getAuditLogs());
    });
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'candidateCount' | 'biasFlagCount' | 'avgMatchScore'>): Promise<Job> => {
    const newJob = await jobService.createJob(jobData);
    setJobs(HireFairStore.getJobs());
    setBiasFlags(HireFairStore.getBiasFlags());
    setActiveJobId(newJob.id);

    await auditService.logEvent(
      'Job Created',
      'job',
      newJob.id,
      `Created job vacancy "${newJob.title}" with automatic AI requirement extraction and bias scan (${newJob.biasFlagCount} potential flags).`,
      newJob.title
    );
    setAuditLogs(HireFairStore.getAuditLogs());

    await notificationService.addNotification(
      'New Job Published',
      `"${newJob.title}" created with AI requirement extraction ready for candidate screening.`,
      'success',
      `/jobs/${newJob.id}`
    );
    setNotifications(HireFairStore.getNotifications());

    return newJob;
  };

  const startBatchScreening = async (jobId: string, candidateIds?: string[]) => {
    const targetJob = jobs.find((j) => j.id === jobId) || activeJob;
    if (!targetJob) return;

    setIsScreeningRunning(true);
    setScreeningProgressIndex(0);

    const targetCandidates = candidateIds && candidateIds.length > 0
      ? candidates.filter((c) => candidateIds.includes(c.id))
      : candidates.filter((c) => c.appliedJobId === jobId || c.appliedJobId === 'job-01');

    await screeningService.batchScreenCandidates(
      targetCandidates,
      targetJob,
      settings.screeningWeights,
      (idx, stage) => {
        setScreeningProgressIndex(idx);
        setScreeningProgressStage(stage);
      }
    );

    setIsScreeningRunning(false);
    setScreenings(HireFairStore.getScreenings());

    await auditService.logEvent(
      'AI Screening Completed',
      'screening',
      jobId,
      `Completed 9-stage transparent AI candidate screening for ${targetCandidates.length} applicants against ${targetJob.title}.`,
      targetJob.title
    );
    setAuditLogs(HireFairStore.getAuditLogs());

    await notificationService.addNotification(
      'AI Screening Completed',
      `Screening analysis ready for ${targetCandidates.length} candidates in "${targetJob.title}".`,
      'success',
      `/jobs/${jobId}/candidates`
    );
    setNotifications(HireFairStore.getNotifications());
  };

  const uploadCustomResume = async (
    file: { name: string; type: string; size: number; content?: string },
    jobId: string
  ): Promise<Candidate> => {
    const cleanName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/^resume_?/i, '')
      .replace(/[_-]/g, ' ')
      .trim();
    const candidateName = cleanName || 'Uploaded Applicant';
    const codeNum = Math.floor(100 + Math.random() * 900);
    const candidateCode = `Candidate #U${codeNum}`;
    const newId = `cand-up-${Date.now()}`;
    const targetJob = jobs.find((j) => j.id === jobId) || activeJob || jobs[0];

    const newCandidate: Candidate = {
      id: newId,
      candidateCode,
      name: candidateName,
      email: `${candidateName.toLowerCase().replace(/\s+/g, '.')}@candidate-pool.net`,
      phone: '+1 (555) 492-' + Math.floor(1000 + Math.random() * 9000),
      location: 'San Francisco, CA',
      currentTitle: `${targetJob.title.split(' ')[0]} Specialist`,
      experienceYears: 3.5,
      education: [
        {
          degree: 'B.S. in Computer Science',
          field: 'Software Engineering',
          institution: 'State University',
          year: '2022',
        },
      ],
      skills: targetJob.requiredSkills.map((req, idx) => ({
        name: req,
        status: idx < targetJob.requiredSkills.length - 1 ? 'matched' : 'partial',
        category: 'required',
        contextSnippet: `Extracted from uploaded resume "${file.name}" under verified competencies.`,
      })),
      experience: [
        {
          role: `${targetJob.title.split(' ')[0]} Developer`,
          company: 'Tech Solutions Inc.',
          duration: '2023 - Present',
          years: 3,
          location: 'San Francisco, CA',
          highlights: [
            `Built scalable software components aligned with ${targetJob.title} specifications`,
            'Collaborated with cross-functional product and engineering teams',
          ],
        },
      ],
      projects: [
        {
          title: `${targetJob.title} System Implementation`,
          technologies: targetJob.requiredSkills.slice(0, 3),
          description: `Engineered core modules using ${targetJob.requiredSkills.slice(0, 2).join(' and ')}.`,
        },
      ],
      certifications: ['Certified Software Practitioner'],
      languages: ['English (Fluent)'],
      appliedJobId: targetJob.id,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      rawResumeText: file.content || `Extracted resume document content for ${candidateName}. Skills matching ${targetJob.title}.`,
      summary: `Applicant profile parsed directly from uploaded resume file (${file.name}). Evaluated with transparent Fair Screening criteria.`,
    };

    await candidateService.addCandidate(newCandidate);
    setCandidates(HireFairStore.getCandidates());

    // Compute instant transparent match score
    const screeningResult = AiService.calculateScreeningScore(newCandidate, targetJob, settings.screeningWeights);
    const currentScreenings = HireFairStore.getScreenings();
    currentScreenings[`${newCandidate.id}_${targetJob.id}`] = screeningResult;
    HireFairStore.saveScreenings(currentScreenings);
    setScreenings({ ...currentScreenings });

    await auditService.logEvent(
      'Resume Uploaded & Screened',
      'candidate',
      newCandidate.id,
      `Parsed uploaded resume "${file.name}" for ${targetJob.title}. Generated candidate ID ${candidateCode}.`,
      newCandidate.name
    );
    setAuditLogs(HireFairStore.getAuditLogs());

    return newCandidate;
  };

  const shortlistCandidate = async (candidateId: string, reason: string, notes?: string) => {
    const { candidate, decision } = await candidateService.updateCandidateStatus(
      candidateId,
      'shortlisted',
      currentUser.id,
      currentUser.name,
      reason,
      notes
    );

    setCandidates(HireFairStore.getCandidates());
    setDecisions(HireFairStore.getDecisions());

    await auditService.logEvent(
      'Candidate Shortlisted',
      'candidate',
      candidate.id,
      `Recruiter ${currentUser.name} shortlisted ${candidate.name} (${candidate.candidateCode}) for ${decision.jobTitle}. Reason: ${reason}`,
      candidate.name
    );
    setAuditLogs(HireFairStore.getAuditLogs());

    await notificationService.addNotification(
      'Candidate Shortlisted',
      `${candidate.candidateCode} was moved to interview pipeline by ${currentUser.name}.`,
      'info',
      `/candidates/${candidate.id}`
    );
    setNotifications(HireFairStore.getNotifications());
  };

  const rejectCandidate = async (candidateId: string, reason: string, notes?: string) => {
    const { candidate, decision } = await candidateService.updateCandidateStatus(
      candidateId,
      'rejected',
      currentUser.id,
      currentUser.name,
      reason,
      notes
    );

    setCandidates(HireFairStore.getCandidates());
    setDecisions(HireFairStore.getDecisions());

    await auditService.logEvent(
      'Candidate Rejected',
      'candidate',
      candidate.id,
      `Human reviewer ${currentUser.name} marked ${candidate.candidateCode} as not moving forward. Reason: ${reason}`,
      candidate.name
    );
    setAuditLogs(HireFairStore.getAuditLogs());
  };

  const markCandidateForReview = async (candidateId: string, reason: string, notes?: string) => {
    const { candidate } = await candidateService.updateCandidateStatus(
      candidateId,
      'review',
      currentUser.id,
      currentUser.name,
      reason,
      notes
    );

    setCandidates(HireFairStore.getCandidates());
    setDecisions(HireFairStore.getDecisions());

    await auditService.logEvent(
      'Candidate Moved to Review',
      'candidate',
      candidate.id,
      `Recruiter requested further technical review for ${candidate.candidateCode}. Reason: ${reason}`,
      candidate.name
    );
    setAuditLogs(HireFairStore.getAuditLogs());
  };

  const resolveBiasFlag = async (flagId: string) => {
    const updated = await biasService.updateBiasStatus(flagId, 'resolved', currentUser.name);
    setBiasFlags(HireFairStore.getBiasFlags());

    await auditService.logEvent(
      'Bias Flag Resolved',
      'bias_flag',
      flagId,
      `Recruiter resolved wording issue on ${updated.jobTitle} with neutral suggested revision.`,
      updated.issue
    );
    setAuditLogs(HireFairStore.getAuditLogs());

    await notificationService.addNotification(
      'Bias Flag Resolved',
      `Language revision applied to ${updated.jobTitle}.`,
      'success',
      '/bias-analysis'
    );
    setNotifications(HireFairStore.getNotifications());
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    HireFairStore.saveSettings(merged);

    // Recalculate screenings if weights changed
    if (newSettings.screeningWeights && activeJob) {
      const cands = candidates.filter((c) => c.appliedJobId === activeJob.id);
      const scr = { ...screenings };
      cands.forEach((c) => {
        scr[`${c.id}_${activeJob.id}`] = AiService.calculateScreeningScore(c, activeJob, merged.screeningWeights);
      });
      setScreenings(scr);
      HireFairStore.saveScreenings(scr);
    }

    auditService.logEvent(
      'Settings Updated',
      'settings',
      'global-settings',
      'Updated scoring weights and compliance parameters.'
    ).then(() => {
      setAuditLogs(HireFairStore.getAuditLogs());
    });
  };

  const resetDemoData = () => {
    HireFairStore.resetToDefault();
    setJobs(HireFairStore.getJobs());
    setCandidates(HireFairStore.getCandidates());
    setScreenings(HireFairStore.getScreenings());
    setBiasFlags(HireFairStore.getBiasFlags());
    setDecisions(HireFairStore.getDecisions());
    setAuditLogs(HireFairStore.getAuditLogs());
    setNotifications(HireFairStore.getNotifications());
    setSettings(HireFairStore.getSettings());
    setCurrentUser(HireFairStore.getCurrentUser());
    setActiveJobId('job-01');
    setCompareCandidateIds(['cand-01', 'cand-02']);
    navigate('/dashboard');
  };

  const toggleCompareCandidate = (candidateId: string) => {
    setCompareCandidateIds((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], candidateId];
      }
      return [...prev, candidateId];
    });
  };

  const clearComparison = () => {
    setCompareCandidateIds([]);
  };

  const markNotificationRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(HireFairStore.getNotifications());
  };

  const markAllNotificationsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(HireFairStore.getNotifications());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole: currentUser.role,
        jobs,
        activeJobId,
        activeJob,
        candidates,
        screenings,
        biasFlags,
        decisions,
        auditLogs,
        notifications,
        settings,
        fairScreeningMode,
        searchQuery,
        currentPath,
        compareCandidateIds,
        isScreeningRunning,
        screeningProgressStage,
        screeningProgressIndex,
        isSidebarOpen,
        navigate,
        setSearchQuery,
        setActiveJobId,
        toggleSidebar,
        setSidebarOpen,
        closeSidebar,
        loginAsRole,
        logout,
        createJob,
        startBatchScreening,
        uploadCustomResume,
        shortlistCandidate,
        rejectCandidate,
        markCandidateForReview,
        resolveBiasFlag,
        toggleFairScreeningMode,
        updateSettings,
        resetDemoData,
        toggleCompareCandidate,
        clearComparison,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
