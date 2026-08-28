/**
 * AI Security, Prompt Injection & Adversarial Defense Guard
 * Protects resume screening, job description extraction, and candidate evaluation
 * against Prompt Injections, Jailbreaks, Delimiter Hijacking, and Hidden Text Attacks.
 */

export interface SecurityAuditResult {
  isSafe: boolean;
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  sanitizedText: string;
  detectedThreats: Array<{
    type: 'prompt_injection' | 'jailbreak' | 'hidden_instruction' | 'eval_manipulation' | 'malicious_script';
    description: string;
    matchedPattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  confidenceScore: number;
}

// Patterns commonly used in prompt injection / adversarial resume manipulation
const ADVERSARIAL_PATTERNS = [
  // Direct command override attempts
  {
    regex: /(ignore\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules|commands))/i,
    type: 'prompt_injection' as const,
    severity: 'critical' as const,
    description: 'Direct prompt injection attempting to override system screening guidelines.',
  },
  {
    regex: /(disregard\s+(the\s+)?(scoring|rubric|criteria|evaluations?))/i,
    type: 'prompt_injection' as const,
    severity: 'critical' as const,
    description: 'System override instruction attempting to bypass evaluation criteria.',
  },
  // Evaluation score spoofing / forced outputs
  {
    regex: /(give\s+(this|the)\s+candidate\s+(a\s+)?(100%?|perfect\s+score|maximum|highest\s+rank))/i,
    type: 'eval_manipulation' as const,
    severity: 'high' as const,
    description: 'Targeted manipulation attempting to force a 100% or top-tier match score.',
  },
  {
    regex: /(output\s+JSON\s+with\s+overallScore:\s*100|set\s+matchGrade\s+to\s+["']?Strong Match["']?)/i,
    type: 'eval_manipulation' as const,
    severity: 'critical' as const,
    description: 'Structured output injection attempting to forge system JSON responses.',
  },
  // Roleplaying / Jailbreaking
  {
    regex: /(you\s+are\s+now\s+(DAN|unrestricted|in\s+developer\s+mode|freed\s+from\s+rules))/i,
    type: 'jailbreak' as const,
    severity: 'critical' as const,
    description: 'Jailbreak attempt trying to reset model identity and constraints.',
  },
  {
    regex: /(act\s+as\s+an?\s+unbiased\s+bot\s+that\s+always\s+shortlists)/i,
    type: 'jailbreak' as const,
    severity: 'high' as const,
    description: 'Behavioral constraint override attempting to force automatic shortlisting.',
  },
  // Hidden text / white-on-white text injection simulation
  {
    regex: /(\[SYSTEM\s*NOTE\]|\[AI\s*DIRECTIVE\]|\[PROMPT_OVERRIDE\]|<!--\s*system_instructions)/i,
    type: 'hidden_instruction' as const,
    severity: 'high' as const,
    description: 'Synthetic system tags injected into resume payload.',
  },
  // Script / HTML payload sanitization
  {
    regex: /(<script[\s\S]*?>[\s\S]*?<\/script>|javascript:|onerror\s*=|onload\s*=)/i,
    type: 'malicious_script' as const,
    severity: 'critical' as const,
    description: 'Executable script or XSS payload detected in document text.',
  },
];

export class AISecurityGuard {
  /**
   * Sanitizes input text, removing executable tags and normalizing adversarial whitespace.
   */
  static sanitizeText(input: string): string {
    if (!input) return '';
    return input
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '[SANITIZED_SCRIPT]')
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
      .replace(/javascript:/gi, 'sanitized-scheme:')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters used for hidden injection
      .trim();
  }

  /**
   * Performs deep heuristic and regex-based security auditing on input text.
   */
  static auditInput(rawInput: string): SecurityAuditResult {
    const sanitized = this.sanitizeText(rawInput);
    const threats: SecurityAuditResult['detectedThreats'] = [];

    for (const pattern of ADVERSARIAL_PATTERNS) {
      const match = sanitized.match(pattern.regex);
      if (match) {
        threats.push({
          type: pattern.type,
          description: pattern.description,
          matchedPattern: match[0],
          severity: pattern.severity,
        });
      }
    }

    // Determine highest threat level
    let threatLevel: SecurityAuditResult['threatLevel'] = 'none';
    if (threats.some((t) => t.severity === 'critical')) {
      threatLevel = 'critical';
    } else if (threats.some((t) => t.severity === 'high')) {
      threatLevel = 'high';
    } else if (threats.some((t) => t.severity === 'medium')) {
      threatLevel = 'medium';
    } else if (threats.some((t) => t.severity === 'low')) {
      threatLevel = 'low';
    }

    const isSafe = threatLevel === 'none' || threatLevel === 'low';
    const confidenceScore = isSafe ? 0.99 : 0.95;

    return {
      isSafe,
      threatLevel,
      sanitizedText: sanitized,
      detectedThreats: threats,
      confidenceScore,
    };
  }

  /**
   * Wraps prompt content in defensive boundary delimiters to prevent prompt leak & instruction confusion.
   */
  static applyDefensiveDelimiters(contextName: string, content: string): string {
    const boundaryId = `SECURE_PAYLOAD_${Date.now()}`;
    return `
--- BEGIN UNTRUSTED USER DATA (${contextName}) [ID: ${boundaryId}] ---
${this.sanitizeText(content)}
--- END UNTRUSTED USER DATA (${contextName}) [ID: ${boundaryId}] ---
    `.trim();
  }
}
