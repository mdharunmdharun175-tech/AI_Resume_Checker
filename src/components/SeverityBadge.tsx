import React from 'react';
import { BiasSeverity, BiasCategory } from '../types';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface SeverityBadgeProps {
  severity: BiasSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (severity) {
    case 'critical':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Critical
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-orange-50 text-orange-700 border border-orange-200 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
          High
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Medium
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Low
        </span>
      );
    default:
      return null;
  }
};

export const CategoryBadge: React.FC<{ category: BiasCategory }> = ({ category }) => {
  const labels: Record<BiasCategory, { name: string; style: string }> = {
    age: { name: 'Age-Related', style: 'bg-purple-50 text-purple-700 border-purple-200' },
    gender: { name: 'Gender-Skewed', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    nationality: { name: 'Nationality / Language', style: 'bg-sky-50 text-sky-700 border-sky-200' },
    experience: { name: 'Experience Gate', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    lifestyle: { name: 'Lifestyle / Overtime', style: 'bg-rose-50 text-rose-700 border-rose-200' },
    other: { name: 'Institution / Pedigree', style: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  const item = labels[category] || labels.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.style}`}>
      {item.name}
    </span>
  );
};
