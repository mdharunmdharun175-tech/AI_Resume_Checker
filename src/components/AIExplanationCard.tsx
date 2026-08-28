import React from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Info, Sparkles, HelpCircle, Lock } from 'lucide-react';
import { ScreeningResult, Candidate, Job } from '../types';
import { MatchScore } from './MatchScore';

interface AIExplanationCardProps {
  candidate: Candidate;
  job: Job;
  screening: ScreeningResult;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({
  candidate,
  job,
  screening,
}) => {
  const { breakdown, weightsUsed, matchedEvidence, missingEvidence, semanticExplanation, criteriaTransparency, securityAudit } = screening;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      {/* AI Security Threat Guard Status Banner */}
      {securityAudit && (
        <div
          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
            securityAudit.isSafe
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {securityAudit.isSafe ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
            )}
            <div>
              <div className="font-bold text-xs flex items-center gap-2">
                <span>AI Security Level: {securityAudit.isSafe ? 'Verified & Protected' : 'Adversarial Threat Detected'}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    securityAudit.threatLevel === 'none' || securityAudit.threatLevel === 'low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Threat: {securityAudit.threatLevel}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] opacity-90">
                {securityAudit.isSafe
                  ? 'Input document passed deep regex heuristic sanitization, delimiter bounds checking, and prompt injection defense.'
                  : `Security Alert: ${securityAudit.securityFlags?.join(', ') || 'Potential prompt injection attempt neutralized.'}`}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white/80 px-2 py-1 rounded-lg border border-slate-200">
            <Lock className="w-3 h-3 text-indigo-600" />
            <span>Isolated Sandbox</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Why this candidate received this score
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Explainable AI breakdown evaluating verified resume content against <span className="font-semibold text-slate-700">{job.title}</span> requirements.
          </p>
        </div>

        <div className="shrink-0">
          <MatchScore score={screening.overallScore} grade={screening.matchGrade} size="md" />
        </div>
      </div>

      {/* Match Breakdown Progress Bars */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Match Breakdown & Scoring Weights
        </h4>
        <div className="space-y-3">
          {/* Required Skills */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Required Skills</span>
                <span className="text-slate-400 font-normal">({Math.round(weightsUsed.requiredSkills * 100)}% weight)</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.requiredSkillsScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.requiredSkillsScore}%` }}
              ></div>
            </div>
          </div>

          {/* Relevant Experience */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Relevant Experience</span>
                <span className="text-slate-400 font-normal">({Math.round(weightsUsed.experience * 100)}% weight)</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.experienceScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.experienceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Semantic Match */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Semantic Job Match</span>
                <span className="text-slate-400 font-normal">({Math.round(weightsUsed.semanticMatch * 100)}% weight)</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.semanticScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.semanticScore}%` }}
              ></div>
            </div>
          </div>

          {/* Job-Related Education */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Job-Related Education</span>
                <span className="text-slate-400 font-normal">({Math.round(weightsUsed.education * 100)}% weight)</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.educationScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.educationScore}%` }}
              ></div>
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Preferred Skills</span>
                <span className="text-slate-400 font-normal">({Math.round(weightsUsed.preferredSkills * 100)}% weight)</span>
              </span>
              <span className="font-bold text-slate-900">{breakdown.preferredSkillsScore}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-slate-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${breakdown.preferredSkillsScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Calculation Formula Display */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 overflow-x-auto">
          <span className="font-bold text-slate-800">Calculation:</span> ({breakdown.requiredSkillsScore} × {weightsUsed.requiredSkills}) + ({breakdown.experienceScore} × {weightsUsed.experience}) + ({breakdown.semanticScore} × {weightsUsed.semanticMatch}) + ({breakdown.educationScore} × {weightsUsed.education}) + ({breakdown.preferredSkillsScore} × {weightsUsed.preferredSkills}) = <span className="font-bold text-indigo-700">{screening.overallScore}%</span>
        </div>
      </div>

      {/* Semantic Alignment Explanation */}
      <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs">
        <span className="font-bold text-indigo-950 block mb-1">Semantic Context & NLP Analysis:</span>
        <p className="text-indigo-900 leading-relaxed">{semanticExplanation}</p>
      </div>

      {/* Evidence vs Missing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Evidence */}
        <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200/80">
          <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2.5">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            Verified Evidence In Resume ({matchedEvidence.length})
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {matchedEvidence.map((ev, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing / Not Identified */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
            <X className="w-4 h-4 text-slate-400 stroke-[3]" />
            Missing / Not Identified ({missingEvidence.length})
          </h5>
          {missingEvidence.length === 0 ? (
            <p className="text-xs text-slate-500">All required and preferred competencies were identified.</p>
          ) : (
            <ul className="space-y-1.5 text-xs text-slate-600">
              {missingEvidence.map((ms, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold mt-0.5">✕</span>
                  <span>{ms}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Screening Criteria Audit Checklist */}
      <div className="pt-4 border-t border-slate-100">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Screening Criteria Transparency Audit
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {criteriaTransparency.map((crit, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border flex items-center justify-between ${
                crit.jobRelevant
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {crit.checked ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                    ✕
                  </span>
                )}
                <span className="font-medium text-[11px]">{crit.name}</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                crit.jobRelevant ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {crit.jobRelevant ? 'Job-Relevant' : 'Excluded'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Human-in-the-loop legal / fairness disclaimer */}
      <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Human Review Notice:</strong> AI-generated analysis is an assistive tool and must be reviewed by an authorized recruiter or hiring manager. Missing resume mentions do not necessarily mean the candidate lacks a skill. Final hiring decisions rest strictly with human decision-makers.
        </p>
      </div>
    </div>
  );
};
