import React, { useState } from 'react';
import {
  GitCompare,
  ArrowLeft,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MatchScore } from '../components/MatchScore';
import { SkillBadge } from '../components/SkillBadge';
import { FairScreeningBanner } from '../components/FairScreeningBanner';
import { DecisionModal } from '../components/DecisionModal';
import { Candidate } from '../types';

export const CandidateComparePage: React.FC = () => {
  const {
    candidates,
    jobs,
    activeJobId,
    screenings,
    compareCandidateIds,
    toggleCompareCandidate,
    clearCompareCandidates,
    fairScreeningMode,
    navigate,
  } = useApp();

  const [selectedForDecision, setSelectedForDecision] = useState<{
    candidate: Candidate;
    action: 'shortlist' | 'review' | 'reject';
  } | null>(null);

  const targetJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // If none selected, default to top 2 candidates
  const comparedCandidates =
    compareCandidateIds.length > 0
      ? candidates.filter((c) => compareCandidateIds.includes(c.id))
      : candidates.slice(0, 2);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/candidates')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Candidate List</span>
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-indigo-600" />
            <span>Side-by-Side Candidate Comparison</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating candidates against job requirements for <strong className="text-slate-800">{targetJob.title}</strong>.
          </p>
        </div>

        {/* Clear & Add controls */}
        <div className="flex items-center gap-2">
          {compareCandidateIds.length > 0 && (
            <button
              onClick={clearCompareCandidates}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              Reset Comparison
            </button>
          )}
        </div>
      </div>

      {/* Fair Screening Mode Banner */}
      <FairScreeningBanner compact={true} />

      {/* Comparison Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Top Header Row with Candidate Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/70 border-b border-slate-200">
          {/* Col 0: Requirements Spec */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Evaluation Criteria
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {targetJob.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {targetJob.department} · {targetJob.experienceRequired} Required
              </p>
            </div>

            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Transparent Weights:</span>
              <div>Required Skills: 40%</div>
              <div>Experience: 25%</div>
              <div>Semantic Match: 20%</div>
              <div>Education: 5% | Preferred: 10%</div>
            </div>
          </div>

          {/* Compared Candidate Columns */}
          {comparedCandidates.map((cand) => {
            const scr = screenings[`${cand.id}_${targetJob.id}`] || {
              overallScore: 80,
              matchGrade: 'Good Match',
              breakdown: {
                requiredSkillsScore: 85,
                experienceScore: 80,
                semanticScore: 78,
                educationScore: 90,
                preferredSkillsScore: 70,
              },
              semanticExplanation: 'Strong software engineering capabilities.',
            };

            const displayName = fairScreeningMode ? cand.candidateCode : cand.name;
            const displayTitle = cand.currentTitle;

            return (
              <div key={cand.id} className="p-5 bg-white flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                        <span>{displayName}</span>
                        {fairScreeningMode && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="text-xs text-slate-500">{displayTitle}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cand.status === 'shortlisted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cand.status === 'review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cand.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Overall Match
                    </span>
                    <MatchScore score={scr.overallScore} grade={scr.matchGrade} size="md" />
                  </div>
                </div>

                {/* Recruiter quick actions on column */}
                <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedForDecision({ candidate: cand, action: 'shortlist' })}
                    className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-md transition-colors cursor-pointer text-center"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => setSelectedForDecision({ candidate: cand, action: 'review' })}
                    className="py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-md transition-colors cursor-pointer text-center"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => setSelectedForDecision({ candidate: cand, action: 'reject' })}
                    className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-md transition-colors cursor-pointer text-center"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Criteria Rows */}
        <div className="divide-y divide-slate-100 text-xs">
          {/* Row 1: Required Skills Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 items-center">
            <div className="font-bold text-slate-800 mb-2 md:mb-0">
              Required Skills Match (40%)
            </div>
            {comparedCandidates.map((cand) => {
              const scr = screenings[`${cand.id}_${targetJob.id}`];
              const score = scr ? scr.breakdown.requiredSkillsScore : 85;
              return (
                <div key={cand.id} className="p-2 space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Score:</span>
                    <span className="text-emerald-700">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${score}%` }}></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cand.skills
                      .filter((s) => s.category === 'required')
                      .map((sk) => (
                        <SkillBadge key={sk.name} name={sk.name} status={sk.status} size="sm" />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: Relevant Experience */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 items-center">
            <div className="font-bold text-slate-800 mb-2 md:mb-0">
              Relevant Experience (25%)
            </div>
            {comparedCandidates.map((cand) => {
              const scr = screenings[`${cand.id}_${targetJob.id}`];
              const score = scr ? scr.breakdown.experienceScore : 80;
              return (
                <div key={cand.id} className="p-2 space-y-1">
                  <div className="font-bold text-slate-900 text-sm">
                    {cand.experienceYears} Years Verified Experience
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Scored {score}% against {targetJob.experienceRequired} target
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 3: Semantic Alignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 items-start">
            <div className="font-bold text-slate-800 mb-2 md:mb-0">
              Semantic Alignment (20%)
            </div>
            {comparedCandidates.map((cand) => {
              const scr = screenings[`${cand.id}_${targetJob.id}`];
              return (
                <div key={cand.id} className="p-2 text-slate-600 text-[11px] leading-relaxed">
                  {scr ? scr.semanticExplanation : 'Verified alignment with core backend software engineering.'}
                </div>
              );
            })}
          </div>

          {/* Row 4: Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 items-center">
            <div className="font-bold text-slate-800 mb-2 md:mb-0">
              Job-Related Education (5%)
            </div>
            {comparedCandidates.map((cand) => (
              <div key={cand.id} className="p-2 space-y-1">
                {cand.education.map((edu, i) => (
                  <div key={i} className="text-slate-800 font-medium">
                    {edu.degree} ({edu.year})
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedForDecision && (
        <DecisionModal
          isOpen={true}
          onClose={() => setSelectedForDecision(null)}
          candidate={selectedForDecision.candidate}
          job={targetJob}
          screening={screenings[`${selectedForDecision.candidate.id}_${targetJob.id}`]}
          initialDecision={selectedForDecision.action}
        />
      )}
    </div>
  );
};
