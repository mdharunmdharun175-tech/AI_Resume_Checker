import React from 'react';
import { MatchGrade } from '../types';

interface MatchScoreProps {
  score: number;
  grade?: MatchGrade;
  size?: 'sm' | 'md' | 'lg';
  showGrade?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  grade,
  size = 'md',
  showGrade = true,
}) => {
  let computedGrade: MatchGrade = grade || 'Low Match';
  if (!grade) {
    if (score >= 88) computedGrade = 'Strong Match';
    else if (score >= 80) computedGrade = 'Good Match';
    else if (score >= 60) computedGrade = 'Review';
    else computedGrade = 'Low Match';
  }

  let colorClasses = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-600';

  if (computedGrade === 'Strong Match') {
    colorClasses = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    barColor = 'bg-emerald-500';
  } else if (computedGrade === 'Good Match') {
    colorClasses = 'text-blue-700 bg-blue-50 border-blue-200';
    barColor = 'bg-blue-500';
  } else if (computedGrade === 'Review') {
    colorClasses = 'text-amber-800 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  } else {
    colorClasses = 'text-slate-700 bg-slate-100 border-slate-200';
    barColor = 'bg-slate-400';
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
        <span>{score}%</span>
        {showGrade && <span className="opacity-80">· {computedGrade}</span>}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-4">
        <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 ${colorClasses}`}>
          <span className="text-2xl font-black">{score}%</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Match</span>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${colorClasses}`}>
            {computedGrade}
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Calculated via transparent job-requirement weights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold border ${colorClasses}`}>
        {score}%
      </span>
      {showGrade && (
        <span className="text-xs font-semibold text-slate-600">
          {computedGrade}
        </span>
      )}
    </div>
  );
};
