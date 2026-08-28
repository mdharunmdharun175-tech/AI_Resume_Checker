import React, { useState } from 'react';
import {
  Candidate,
  Job,
  ScreeningResult,
  CandidateStatus,
} from '../types';
import { useApp } from '../context/AppContext';
import { MatchScore } from './MatchScore';
import { SkillBadge } from './SkillBadge';
import { DecisionModal } from './DecisionModal';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  GitCompare,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface CandidateRankingTableProps {
  candidates: Candidate[];
  job: Job;
  screenings: Record<string, ScreeningResult>;
}

export const CandidateRankingTable: React.FC<CandidateRankingTableProps> = ({
  candidates,
  job,
  screenings,
}) => {
  const {
    fairScreeningMode,
    navigate,
    compareCandidateIds,
    toggleCompareCandidate,
  } = useApp();

  const [selectedCandidateForDecision, setSelectedCandidateForDecision] = useState<{
    candidate: Candidate;
    action: 'shortlist' | 'review' | 'reject';
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'exp_desc'>('score_desc');

  // Pair candidates with their screening result and sort
  const scoredCandidates = candidates.map((cand) => {
    const scrKey = `${cand.id}_${job.id}`;
    const screening = screenings[scrKey] || {
      overallScore: 75,
      matchGrade: 'Review',
      breakdown: {
        requiredSkillsScore: 75,
        experienceScore: 75,
        semanticScore: 75,
        educationScore: 80,
        preferredSkillsScore: 60,
      },
    };
    return { candidate: cand, screening };
  });

  // Filter
  const filtered = scoredCandidates.filter(({ candidate, screening }) => {
    if (filterStatus !== 'all' && candidate.status !== filterStatus) return false;
    if (filterGrade !== 'all' && screening.matchGrade !== filterGrade) return false;
    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'score_desc') return b.screening.overallScore - a.screening.overallScore;
    if (sortBy === 'score_asc') return a.screening.overallScore - b.screening.overallScore;
    if (sortBy === 'exp_desc') return b.candidate.experienceYears - a.candidate.experienceYears;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Table Controls / Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filter:</span>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="review">Needs Review</option>
            <option value="screening">Screening</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="all">All Match Grades</option>
            <option value="Strong Match">Strong Match (88%+)</option>
            <option value="Good Match">Good Match (80-87%)</option>
            <option value="Review">Review (60-79%)</option>
            <option value="Low Match">Low Match (&lt;60%)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="score_desc">Highest Match Score</option>
            <option value="score_asc">Lowest Match Score</option>
            <option value="exp_desc">Most Experience Years</option>
          </select>
        </div>
      </div>

      {/* Candidates List / Responsive Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4 w-10 text-center">
                  <span title="Select for side-by-side comparison">Comp.</span>
                </th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Required Skills</th>
                <th className="py-3 px-4 text-center">Experience</th>
                <th className="py-3 px-4 text-center">Semantic</th>
                <th className="py-3 px-4 text-center">Overall Match</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Human Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No candidates match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map(({ candidate, screening }, idx) => {
                  const isCompared = compareCandidateIds.includes(candidate.id);
                  const displayName = fairScreeningMode
                    ? candidate.candidateCode
                    : candidate.name;
                  const displaySub = fairScreeningMode
                    ? candidate.currentTitle
                    : `${candidate.candidateCode} · ${candidate.currentTitle}`;

                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        #{idx + 1}
                      </td>

                      {/* Compare Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => toggleCompareCandidate(candidate.id)}
                          title="Select to compare (up to 3)"
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* Candidate Name / Masked Code */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => navigate(`/candidates/${candidate.id}`)}
                          className="cursor-pointer"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                            <span>{displayName}</span>
                            {fairScreeningMode && (
                              <span title="Masked by Fair Screening Mode">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{displaySub}</div>
                        </div>
                      </td>

                      {/* Required Skills Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {candidate.skills
                            .filter((s) => s.category === 'required')
                            .slice(0, 3)
                            .map((sk) => (
                              <SkillBadge
                                key={sk.name}
                                name={sk.name}
                                status={sk.status}
                                size="sm"
                              />
                            ))}
                          {candidate.skills.filter((s) => s.category === 'required').length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium self-center">
                              +{candidate.skills.filter((s) => s.category === 'required').length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-800 block">
                          {candidate.experienceYears} yrs
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {screening.breakdown.experienceScore}%
                        </span>
                      </td>

                      {/* Semantic Match */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold text-slate-700">
                          {screening.breakdown.semanticScore}%
                        </span>
                      </td>

                      {/* Overall Match */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <MatchScore
                            score={screening.overallScore}
                            grade={screening.matchGrade}
                            size="sm"
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
                      </td>

                      {/* Human Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/candidates/${candidate.id}`)}
                            title="View candidate profile & explanation"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setSelectedCandidateForDecision({
                                candidate,
                                action: 'shortlist',
                              })
                            }
                            title="Shortlist candidate"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setSelectedCandidateForDecision({
                                candidate,
                                action: 'review',
                              })
                            }
                            title="Mark for review"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setSelectedCandidateForDecision({
                                candidate,
                                action: 'reject',
                              })
                            }
                            title="Reject candidate"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedCandidateForDecision && (
        <DecisionModal
          isOpen={true}
          onClose={() => setSelectedCandidateForDecision(null)}
          candidate={selectedCandidateForDecision.candidate}
          job={job}
          screening={screenings[`${selectedCandidateForDecision.candidate.id}_${job.id}`]}
          initialDecision={selectedCandidateForDecision.action}
        />
      )}
    </div>
  );
};
