import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Clock,
  MapPin,
  Mail,
  Phone,
  GitCompare,
  Download,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIExplanationCard } from '../components/AIExplanationCard';
import { DecisionModal } from '../components/DecisionModal';
import { SkillBadge } from '../components/SkillBadge';
import { MatchScore } from '../components/MatchScore';
import { FairScreeningBanner } from '../components/FairScreeningBanner';

export const CandidateDetailPage: React.FC<{ candidateId?: string }> = ({ candidateId }) => {
  const {
    candidates,
    jobs,
    activeJobId,
    screenings,
    fairScreeningMode,
    decisions,
    navigate,
    toggleCompareCandidate,
    compareCandidateIds,
  } = useApp();

  const [decisionAction, setDecisionAction] = useState<'shortlist' | 'review' | 'reject' | null>(null);

  const candidate = candidates.find((c) => c.id === candidateId) || candidates[0];
  const targetJob = jobs.find((j) => j.id === candidate.appliedJobId) || jobs[0];
  const screening = screenings[`${candidate.id}_${targetJob.id}`] || {
    id: `scr_${candidate.id}`,
    candidateId: candidate.id,
    jobId: targetJob.id,
    overallScore: 88,
    matchGrade: 'Strong Match' as const,
    breakdown: {
      requiredSkillsScore: 92,
      experienceScore: 85,
      semanticScore: 89,
      educationScore: 90,
      preferredSkillsScore: 80,
    },
    weightsUsed: {
      requiredSkills: 0.4,
      experience: 0.25,
      semanticMatch: 0.2,
      education: 0.05,
      preferredSkills: 0.1,
    },
    matchedEvidence: [
      '4.5 years architecting high-concurrency microservices in Python & FastAPI',
      'Optimized PostgreSQL query latency by 42% on production cluster',
      'Designed RESTful API contracts with OpenAPI specifications',
    ],
    missingEvidence: ['No explicit Docker Swarm clustering referenced in recent positions'],
    semanticExplanation:
      'Candidate showcases strong alignment with high-throughput backend services and Python API architectures.',
    criteriaTransparency: [
      { name: 'Python 3.10+ async fluency', checked: true, jobRelevant: true },
      { name: 'FastAPI microservices', checked: true, jobRelevant: true },
      { name: 'SQL optimization & relational schemas', checked: true, jobRelevant: true },
      { name: 'Demographic & Photo Exclusion', checked: true, jobRelevant: false },
    ],
    createdAt: '2025-02-18T10:00:00Z',
  };

  const isCompared = compareCandidateIds.includes(candidate.id);
  const candidateDecisions = decisions.filter((d) => d.candidateId === candidate.id);

  // Masked or Unmasked fields
  const displayName = fairScreeningMode ? candidate.candidateCode : candidate.name;
  const displayEmail = fairScreeningMode ? 'masked@fair-screening.internal' : candidate.email;
  const displayPhone = fairScreeningMode ? '•••• •••• ••••' : candidate.phone;
  const displayLocation = fairScreeningMode ? 'United States (Work Authorized)' : candidate.location;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/candidates')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Candidate Pipeline</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <span>{displayName}</span>
              {fairScreeningMode && (
                <span title="Demographic identity masked by Fair Screening Mode">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </span>
              )}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                candidate.status === 'shortlisted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : candidate.status === 'review'
                  ? 'bg-amber-100 text-amber-800'
                  : candidate.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {candidate.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
            <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Role: {targetJob.title}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {candidate.experienceYears} Years Experience
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {displayLocation}
            </span>
            {!fairScreeningMode && (
              <>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {displayEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {displayPhone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleCompareCandidate(candidate.id)}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isCompared
                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{isCompared ? 'In Compare List' : 'Compare Candidate'}</span>
          </button>
        </div>
      </div>

      {/* Fair Screening Mode Banner */}
      <FairScreeningBanner compact={true} />

      {/* Recruiter Decision Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Human-in-the-Loop Evaluation Gate
          </span>
          <span className="text-xs text-slate-600 mt-0.5 block">
            AI recommends <strong className="text-slate-900">{screening.matchGrade}</strong>. Final selection decisions must be made by human recruiters.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDecisionAction('shortlist')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Shortlist Candidate</span>
          </button>

          <button
            onClick={() => setDecisionAction('review')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Needs Review</span>
          </button>

          <button
            onClick={() => setDecisionAction('reject')}
            className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs shadow-rose-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Profile Details, Right AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Resume Profile Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Candidate Summary */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Candidate Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {candidate.summary}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Source: <strong className="text-slate-800 font-semibold">{candidate.resumeFileName}</strong></span>
              <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Technical Skills Assessment */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills
                .filter((s) => s.category === 'required')
                .map((sk) => (
                  <SkillBadge
                    key={sk.name}
                    name={sk.name}
                    status={sk.status}
                    size="md"
                  />
                ))}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-3 border-t border-slate-100">
              Preferred & Bonus Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills
                .filter((s) => s.category === 'preferred')
                .map((sk) => (
                  <SkillBadge
                    key={sk.name}
                    name={sk.name}
                    status={sk.status}
                    size="md"
                  />
                ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Experience Timeline ({candidate.experienceYears} Years Total)
            </h3>
            <div className="space-y-4">
              {candidate.workExperience.map((exp, idx) => {
                const companyName = fairScreeningMode ? `Organization #${idx + 1}` : exp.company;
                return (
                  <div key={idx} className="relative pl-4 border-l-2 border-indigo-200 space-y-1">
                    <div className="text-xs font-bold text-slate-900">{exp.role}</div>
                    <div className="text-[11px] text-indigo-700 font-medium">{companyName} · {exp.duration}</div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{exp.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Job-Related Education & Certifications</span>
            </h3>
            <div className="space-y-2">
              {candidate.education.map((edu, idx) => {
                const instName = fairScreeningMode ? 'Accredited University / Program' : edu.institution;
                return (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{instName} · {edu.year}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Deep Explainable AI Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <AIExplanationCard
            candidate={candidate}
            job={targetJob}
            screening={screening}
          />

          {/* Recruiter Decision Audit History */}
          {candidateDecisions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Decision Audit Log for {candidate.candidateCode}
              </h3>
              <div className="space-y-2.5">
                {candidateDecisions.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 capitalize">
                        {d.decision} by {d.recruiterName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(d.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-700">{d.reason}</p>
                    {d.notes && <p className="text-slate-500 italic">Notes: {d.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      {decisionAction && (
        <DecisionModal
          isOpen={true}
          onClose={() => setDecisionAction(null)}
          candidate={candidate}
          job={targetJob}
          screening={screening}
          initialDecision={decisionAction}
        />
      )}
    </div>
  );
};
