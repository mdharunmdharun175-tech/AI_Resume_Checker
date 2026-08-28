export type UserRole = 'recruiter' | 'hiring_manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  title: string;
}

export type JobStatus = 'active' | 'draft' | 'closed' | 'archived';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceRequired: string;
  salaryRange: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  responsibilities: string[];
  qualifications: string[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  candidateCount: number;
  biasFlagCount: number;
  avgMatchScore: number;
  extractedFromDoc?: boolean;
}

export type BiasSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BiasCategory = 'age' | 'gender' | 'nationality' | 'experience' | 'lifestyle' | 'other';
export type BiasStatus = 'open' | 'resolved' | 'dismissed';

export interface BiasFlag {
  id: string;
  jobId: string;
  jobTitle: string;
  issue: string;
  category: BiasCategory;
  severity: BiasSeverity;
  location: string; // e.g. "Job Description - Line 4"
  detectedPhrase: string;
  suggestedRevision: string;
  explanation: string;
  status: BiasStatus;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type CandidateStatus = 'applied' | 'screening' | 'review' | 'shortlisted' | 'interview' | 'selected' | 'rejected';
export type MatchGrade = 'Strong Match' | 'Good Match' | 'Review' | 'Low Match';

export interface SkillMatch {
  name: string;
  status: 'matched' | 'partial' | 'not_found';
  category: 'required' | 'preferred' | 'additional';
  contextSnippet?: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  years: number;
  location: string;
  highlights: string[];
}

export interface CandidateEducation {
  degree: string;
  field: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface CandidateProject {
  title: string;
  technologies: string[];
  description: string;
  link?: string;
}

export interface Candidate {
  id: string;
  candidateCode: string; // e.g. "#A102"
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  experienceYears: number;
  education: CandidateEducation[];
  skills: SkillMatch[];
  experience: WorkExperience[];
  projects: CandidateProject[];
  certifications: string[];
  languages: string[];
  summary: string;
  rawResumeText?: string;
  appliedJobId: string;
  appliedDate: string;
  status: CandidateStatus;
  fairModeMasked?: boolean;
  notes?: string;
}

export interface MatchScoreBreakdown {
  requiredSkillsScore: number; // 0-100
  experienceScore: number; // 0-100
  semanticScore: number; // 0-100
  educationScore: number; // 0-100
  preferredSkillsScore: number; // 0-100
}

export interface ScreeningWeights {
  requiredSkills: number; // default 0.40
  experience: number; // default 0.25
  semanticMatch: number; // default 0.20
  education: number; // default 0.05
  preferredSkills: number; // default 0.10
}

export interface ScreeningResult {
  id: string;
  candidateId: string;
  jobId: string;
  overallScore: number; // calculated weighted score
  matchGrade: MatchGrade;
  breakdown: MatchScoreBreakdown;
  weightsUsed: ScreeningWeights;
  matchedEvidence: string[];
  missingEvidence: string[];
  semanticExplanation: string;
  criteriaTransparency: {
    name: string;
    checked: boolean;
    jobRelevant: boolean;
    note: string;
  }[];
  processedAt: string;
  isFairModeProcessed: boolean;
}

export interface RecruiterDecision {
  id: string;
  candidateId: string;
  candidateCode: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  recruiterId: string;
  recruiterName: string;
  decision: 'shortlist' | 'review' | 'reject';
  previousStatus: CandidateStatus;
  newStatus: CandidateStatus;
  reason: string;
  notes?: string;
  timestamp: string;
  aiSuggestedMatch: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'job' | 'resume' | 'candidate' | 'screening' | 'bias_flag' | 'settings' | 'auth';
  entityId: string;
  entityName?: string;
  details: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  link?: string;
}

export interface AppSettings {
  fairScreeningDefault: boolean;
  maskCandidateNamesInFairMode: boolean;
  maskContactInfoInFairMode: boolean;
  maskPhotosAndDemographics: boolean;
  screeningWeights: ScreeningWeights;
  minShortlistThreshold: number; // default 80
  minReviewThreshold: number; // default 60
  notificationsEnabled: boolean;
  strictBiasThreshold: boolean;
  humanInTheLoopEnforced: boolean;
}
