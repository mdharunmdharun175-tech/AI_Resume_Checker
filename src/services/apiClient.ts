import {
  mockJobs,
  mockCandidates,
  mockScreenings,
  mockBiasFlags,
  mockDecisions,
  mockAuditLogs,
  mockNotifications,
  defaultSettings,
  mockUsers,
} from '../data/mockData';
import {
  Job,
  Candidate,
  ScreeningResult,
  BiasFlag,
  RecruiterDecision,
  AuditEvent,
  AppNotification,
  AppSettings,
  User,
  ScreeningWeights,
} from '../types';

const STORAGE_KEYS = {
  JOBS: 'hirefair_jobs_v1',
  CANDIDATES: 'hirefair_candidates_v1',
  SCREENINGS: 'hirefair_screenings_v1',
  BIAS_FLAGS: 'hirefair_bias_flags_v1',
  DECISIONS: 'hirefair_decisions_v1',
  AUDIT_LOGS: 'hirefair_audit_logs_v1',
  NOTIFICATIONS: 'hirefair_notifications_v1',
  SETTINGS: 'hirefair_settings_v1',
  CURRENT_USER: 'hirefair_current_user_v1',
};

// Initialize or load stored state
function getStoredItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultVal;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading localStorage for key ${key}:`, e);
    return defaultVal;
  }
}

function setStoredItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error writing localStorage for key ${key}:`, e);
  }
}

export class HireFairStore {
  static getJobs(): Job[] {
    return getStoredItem(STORAGE_KEYS.JOBS, mockJobs);
  }

  static saveJobs(jobs: Job[]): void {
    setStoredItem(STORAGE_KEYS.JOBS, jobs);
  }

  static getCandidates(): Candidate[] {
    return getStoredItem(STORAGE_KEYS.CANDIDATES, mockCandidates);
  }

  static saveCandidates(candidates: Candidate[]): void {
    setStoredItem(STORAGE_KEYS.CANDIDATES, candidates);
  }

  static getScreenings(): Record<string, ScreeningResult> {
    return getStoredItem(STORAGE_KEYS.SCREENINGS, mockScreenings);
  }

  static saveScreenings(screenings: Record<string, ScreeningResult>): void {
    setStoredItem(STORAGE_KEYS.SCREENINGS, screenings);
  }

  static getBiasFlags(): BiasFlag[] {
    return getStoredItem(STORAGE_KEYS.BIAS_FLAGS, mockBiasFlags);
  }

  static saveBiasFlags(flags: BiasFlag[]): void {
    setStoredItem(STORAGE_KEYS.BIAS_FLAGS, flags);
  }

  static getDecisions(): RecruiterDecision[] {
    return getStoredItem(STORAGE_KEYS.DECISIONS, mockDecisions);
  }

  static saveDecisions(decisions: RecruiterDecision[]): void {
    setStoredItem(STORAGE_KEYS.DECISIONS, decisions);
  }

  static getAuditLogs(): AuditEvent[] {
    return getStoredItem(STORAGE_KEYS.AUDIT_LOGS, mockAuditLogs);
  }

  static saveAuditLogs(logs: AuditEvent[]): void {
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  static getNotifications(): AppNotification[] {
    return getStoredItem(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);
  }

  static saveNotifications(notifs: AppNotification[]): void {
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  static getSettings(): AppSettings {
    return getStoredItem(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  static saveSettings(settings: AppSettings): void {
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
  }

  static getCurrentUser(): User {
    return getStoredItem(STORAGE_KEYS.CURRENT_USER, mockUsers[0]);
  }

  static setCurrentUser(user: User): void {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  static resetToDefault(): void {
    setStoredItem(STORAGE_KEYS.JOBS, mockJobs);
    setStoredItem(STORAGE_KEYS.CANDIDATES, mockCandidates);
    setStoredItem(STORAGE_KEYS.SCREENINGS, mockScreenings);
    setStoredItem(STORAGE_KEYS.BIAS_FLAGS, mockBiasFlags);
    setStoredItem(STORAGE_KEYS.DECISIONS, mockDecisions);
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, mockAuditLogs);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);
    setStoredItem(STORAGE_KEYS.SETTINGS, defaultSettings);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, mockUsers[0]);
  }
}
