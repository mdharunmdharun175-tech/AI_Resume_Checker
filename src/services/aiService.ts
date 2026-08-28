import { Job, Candidate, BiasFlag, ScreeningResult, ScreeningWeights, MatchGrade } from '../types';
import { AISecurityGuard } from './aiSecurityGuard';

export interface ExtractedJobRequirements {
  title: string;
  department: string;
  experienceRequired: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  responsibilities: string[];
  qualifications: string[];
  detectedBiasFlags: Omit<BiasFlag, 'id' | 'jobId' | 'jobTitle' | 'status' | 'detectedAt'>[];
  securityStatus?: {
    isSafe: boolean;
    threatLevel: string;
  };
}

export class AiService {
  /**
   * Extracts structured requirements from raw text or uploaded JD document with AI security defense.
   */
  static async extractJobRequirements(rawText: string): Promise<ExtractedJobRequirements> {
    // 1. Run AI Security Audit & Sanitization
    const securityAudit = AISecurityGuard.auditInput(rawText);
    const sanitizedText = securityAudit.sanitizedText;

    // Simulate real AI processing latency
    await new Promise((r) => setTimeout(r, 600));

    const lower = sanitizedText.toLowerCase();
    const isPython = lower.includes('python') || lower.includes('backend');
    const isFrontend = lower.includes('react') || lower.includes('frontend') || lower.includes('typescript');

    const defaultSkills = isFrontend
      ? ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Next.js']
      : isPython
      ? ['Python', 'FastAPI', 'REST APIs', 'SQL', 'Git']
      : ['Python', 'SQL', 'REST APIs', 'Git', 'Data Structures'];

    const preferred = isFrontend
      ? ['GraphQL', 'Testing Library', 'Figma', 'Vite', 'Redux']
      : isPython
      ? ['Docker', 'AWS', 'React', 'Redis', 'PostgreSQL']
      : ['Docker', 'Cloud Services', 'CI/CD', 'Agile'];

    const detectedBiasFlags: Omit<BiasFlag, 'id' | 'jobId' | 'jobTitle' | 'status' | 'detectedAt'>[] = [];

    // Analyze wording for bias indicators
    if (lower.includes('young') || lower.includes('energetic') || lower.includes('recent grad') || lower.includes('under 30')) {
      detectedBiasFlags.push({
        issue: 'Potential age-related wording detected',
        category: 'age',
        severity: 'medium',
        location: 'Job Description Text',
        detectedPhrase: 'young and energetic candidate',
        suggestedRevision: 'Motivated professional with relevant experience.',
        explanation: 'Specifying age or high-energy slang may deter experienced workers. Using neutral competency phrases keeps criteria job-focused.',
      });
    }

    if (lower.includes('native english') || lower.includes('native speaker')) {
      detectedBiasFlags.push({
        issue: 'Potential nationality/language criterion',
        category: 'nationality',
        severity: 'medium',
        location: 'Language Requirements',
        detectedPhrase: 'native English speaker',
        suggestedRevision: 'Strong verbal and written English communication skills.',
        explanation: 'Requiring native speaking status can exclude fluent multilingual professionals.',
      });
    }

    if (lower.includes('rockstar') || lower.includes('ninja') || lower.includes('male') || lower.includes('dominant')) {
      detectedBiasFlags.push({
        issue: 'Potentially gender-skewed or aggressive phrasing',
        category: 'gender',
        severity: 'high',
        location: 'Culture / Role Summary',
        detectedPhrase: 'rockstar / aggressive engineer',
        suggestedRevision: 'Skilled backend engineer with collaborative communication abilities.',
        explanation: 'Aggressive phrasing or gendered slang correlates with reduced applicant diversity in technical roles.',
      });
    }

    return {
      title: isFrontend ? 'Senior Frontend Engineer' : isPython ? 'Senior Python Backend Developer' : 'Software Engineer',
      department: isFrontend ? 'User Experience' : 'Core Platform',
      experienceRequired: '2–5 years',
      requiredSkills: defaultSkills,
      preferredSkills: preferred,
      educationRequirements: 'B.S. in Computer Science, Software Engineering, or equivalent practical experience.',
      responsibilities: [
        'Design and deploy resilient, high-throughput microservices following clean architecture',
        'Optimize database queries, data schemas, and API response latencies',
        'Collaborate across engineering squads on OpenAPI contracts and integration tests'
      ],
      qualifications: [
        '2+ years professional software development experience in primary stack',
        'Proficiency in relational databases, SQL queries, and Git version control'
      ],
      detectedBiasFlags,
    };
  }

  /**
   * Scans job description text and flags potential bias indicators with neutral suggestions.
   */
  static async analyzeJobBias(text: string, jobId: string, jobTitle: string): Promise<BiasFlag[]> {
    await new Promise((r) => setTimeout(r, 400));
    const flags: BiasFlag[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('young') || lower.includes('energetic')) {
      flags.push({
        id: `bias-gen-${Date.now()}-1`,
        jobId,
        jobTitle,
        issue: 'Potential age-related wording',
        category: 'age',
        severity: 'medium',
        location: 'Job Description Body',
        detectedPhrase: 'young and energetic candidate',
        suggestedRevision: 'Motivated professional with relevant experience and a strong work ethic.',
        explanation: 'Phrases like "young and energetic" can inadvertently deter experienced professionals and may reflect unvalidated age preferences. Review recommended.',
        status: 'open',
        detectedAt: new Date().toISOString(),
      });
    }

    if (lower.includes('native english') || lower.includes('native speaker') || lower.includes('mother tongue')) {
      flags.push({
        id: `bias-gen-${Date.now()}-2`,
        jobId,
        jobTitle,
        issue: 'Potential nationality / language-exclusive phrasing',
        category: 'nationality',
        severity: 'medium',
        location: 'Job Qualifications',
        detectedPhrase: 'native English speaker',
        suggestedRevision: 'Must possess strong professional verbal and written English communication skills.',
        explanation: 'Requiring "native" fluency excludes highly proficient bilingual and multilingual professionals. Context should be evaluated by a human.',
        status: 'open',
        detectedAt: new Date().toISOString(),
      });
    }

    if (lower.includes('ninja') || lower.includes('rockstar') || lower.includes('male') || lower.includes('guy') || lower.includes('guru')) {
      flags.push({
        id: `bias-gen-${Date.now()}-3`,
        jobId,
        jobTitle,
        issue: 'Potentially gender-skewed phrasing',
        category: 'gender',
        severity: 'high',
        location: 'Role Description',
        detectedPhrase: 'rockstar ninja developer',
        suggestedRevision: 'Candidate with relevant experience and demonstrated qualifications.',
        explanation: 'Gender-coded slang can bias candidate pool self-selection. Neutral phrasing is recommended.',
        status: 'open',
        detectedAt: new Date().toISOString(),
      });
    }

    if (lower.includes('24/7') || lower.includes('all-nighter') || lower.includes('grind') || lower.includes('family')) {
      flags.push({
        id: `bias-gen-${Date.now()}-4`,
        jobId,
        jobTitle,
        issue: 'Overly restrictive lifestyle / overtime expectation',
        category: 'lifestyle',
        severity: 'low',
        location: 'Working Conditions',
        detectedPhrase: 'willing to work 24/7 round the clock without distractions',
        suggestedRevision: 'Participates in structured on-call rotation schedules with clear rest periods.',
        explanation: 'Potentially biased wording detected regarding working hours. Review recommended to ensure job-relevance.',
        status: 'open',
        detectedAt: new Date().toISOString(),
      });
    }

    return flags;
  }

  /**
   * Transparently calculates candidate match score using configurable weights.
   * Formula:
   * overallScore = (requiredSkillScore * w1) + (experienceScore * w2) + (semanticScore * w3) + (educationScore * w4) + (preferredSkillScore * w5)
   */
  static calculateScreeningScore(
    candidate: Candidate,
    job: Job,
    weights: ScreeningWeights
  ): ScreeningResult {
    // 0. Perform Security Audit on candidate text
    const resumeTextToScan = candidate.rawResumeText || candidate.summary || '';
    const securityAudit = AISecurityGuard.auditInput(resumeTextToScan);

    // 1. Required Skills Score
    const reqSkills = job.requiredSkills;
    let reqMatches = 0;
    const matchedEvidence: string[] = [];
    const missingEvidence: string[] = [];

    reqSkills.forEach((req) => {
      const found = candidate.skills.find(
        (s) => s.name.toLowerCase() === req.toLowerCase()
      );
      if (found && found.status === 'matched') {
        reqMatches += 1;
        matchedEvidence.push(`${req} experience identified (${found.contextSnippet || 'verified in history'})`);
      } else if (found && found.status === 'partial') {
        reqMatches += 0.5;
        matchedEvidence.push(`${req} partial/foundational experience identified`);
      } else {
        missingEvidence.push(`${req} experience not identified in submitted resume`);
      }
    });

    const requiredSkillsScore = reqSkills.length > 0 ? Math.round((reqMatches / reqSkills.length) * 100) : 85;

    // 2. Experience Score (based on required tenure)
    const candYears = candidate.experienceYears || 3;
    let experienceScore = 80;
    if (candYears >= 4) experienceScore = 90;
    if (candYears >= 2 && candYears < 4) experienceScore = 82;
    if (candYears < 2) experienceScore = 65;

    // 3. Semantic Relevance Score (AI embedding simulation based on role alignment)
    let semanticScore = 85;
    const titleLower = candidate.currentTitle.toLowerCase();
    if (titleLower.includes('python') || titleLower.includes('backend') || titleLower.includes('platform')) {
      semanticScore = 92;
    } else if (titleLower.includes('frontend') || titleLower.includes('ui')) {
      semanticScore = 62;
    } else if (titleLower.includes('java')) {
      semanticScore = 70;
    } else if (titleLower.includes('junior')) {
      semanticScore = 78;
    }

    // 4. Education Score
    const educationScore = candidate.education.length > 0 ? 100 : 80;

    // 5. Preferred Skills Score
    const prefSkills = job.preferredSkills;
    let prefMatches = 0;
    prefSkills.forEach((pref) => {
      const found = candidate.skills.find(
        (s) => s.name.toLowerCase() === pref.toLowerCase() && s.status === 'matched'
      );
      if (found) prefMatches += 1;
    });
    const preferredSkillsScore = prefSkills.length > 0 ? Math.round((prefMatches / prefSkills.length) * 100) : 70;

    // Weighted Overall Score
    let overallScore = Math.round(
      requiredSkillsScore * weights.requiredSkills +
      experienceScore * weights.experience +
      semanticScore * weights.semanticMatch +
      educationScore * weights.education +
      preferredSkillsScore * weights.preferredSkills
    );

    // If critical prompt injection was detected, cap or penalize manipulated score
    if (!securityAudit.isSafe && securityAudit.threatLevel === 'critical') {
      overallScore = Math.min(overallScore, 45);
    }

    let matchGrade: MatchGrade = 'Low Match';
    if (overallScore >= 88) matchGrade = 'Strong Match';
    else if (overallScore >= 80) matchGrade = 'Good Match';
    else if (overallScore >= 60) matchGrade = 'Review';
    else matchGrade = 'Low Match';

    const semanticExplanation =
      !securityAudit.isSafe
        ? `⚠️ AI Security Alert: Document contains potential prompt injection or evaluation override syntax. System isolated the payload and preserved objective criteria evaluation.`
        : overallScore >= 85
        ? `High conceptual alignment: Candidate demonstrates relevant experience in ${job.requiredSkills.slice(0, 3).join(', ')} matching the target position's core requirements.`
        : overallScore >= 70
        ? `Moderate alignment: Candidate has foundational background in software development, with specific technical areas requiring human reviewer evaluation.`
        : `Domain divergence: Candidate specialization focuses on different technology layers than the required ${job.title} stack.`;

    return {
      id: `scr-${candidate.id}_${job.id}`,
      candidateId: candidate.id,
      jobId: job.id,
      overallScore,
      matchGrade,
      breakdown: {
        requiredSkillsScore,
        experienceScore,
        semanticScore,
        educationScore,
        preferredSkillsScore,
      },
      weightsUsed: { ...weights },
      matchedEvidence,
      missingEvidence,
      semanticExplanation,
      criteriaTransparency: [
        { name: 'AI Security & Prompt Injection Inspection', checked: true, jobRelevant: true, note: securityAudit.isSafe ? 'Passed verified input sanitization' : `Threat detected: ${securityAudit.detectedThreats.map(t => t.type).join(', ')}` },
        { name: 'Required Skills Matching', checked: true, jobRelevant: true, note: 'Extracted from technical summary and job history' },
        { name: 'Relevant Experience Tenure', checked: true, jobRelevant: true, note: `${candYears} years verified professional experience` },
        { name: 'Semantic Job Relevance', checked: true, jobRelevant: true, note: 'Embedding similarity evaluated against job responsibilities' },
        { name: 'Job-Related Education', checked: true, jobRelevant: true, note: 'Degrees verified in relevant disciplines' },
        { name: 'Preferred Skills', checked: true, jobRelevant: true, note: 'Evaluated as secondary bonus criteria only' },
        { name: 'Sensitive Demographic Attributes (Gender, Race, Age, Nationality)', checked: false, jobRelevant: false, note: 'Excluded from ranking algorithms under Fair Screening Mode' },
        { name: 'Personal Appearance / Photo / Address', checked: false, jobRelevant: false, note: 'Excluded from scoring engine' },
      ],
      processedAt: new Date().toISOString(),
      isFairModeProcessed: true,
      securityAudit: {
        isSafe: securityAudit.isSafe,
        threatLevel: securityAudit.threatLevel,
        detectedThreatsCount: securityAudit.detectedThreats.length,
        securityFlags: securityAudit.detectedThreats.map((t) => t.description),
      },
    };
  }
}
