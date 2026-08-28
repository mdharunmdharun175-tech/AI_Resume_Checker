import React from 'react';
import { Check, AlertCircle, Minus } from 'lucide-react';
import { SkillMatch } from '../types';

interface SkillBadgeProps {
  name: string;
  status: 'matched' | 'partial' | 'not_found';
  category?: 'required' | 'preferred' | 'additional';
  contextSnippet?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  status,
  category,
  contextSnippet,
  showIcon = true,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = <Minus className="w-3 h-3 text-slate-400" />;
  let label = 'Not found';

  if (status === 'matched') {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
    icon = <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />;
    label = 'Matched';
  } else if (status === 'partial') {
    style = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
    icon = <AlertCircle className="w-3 h-3 text-amber-600 stroke-[2]" />;
    label = 'Partial match';
  } else {
    style = 'bg-slate-50 text-slate-500 border-slate-200';
    icon = <span className="text-slate-400 text-xs">✕</span>;
    label = 'Not found in resume';
  }

  return (
    <span
      title={contextSnippet || `${name}: ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-md border transition-colors ${sizeClasses} ${style}`}
    >
      {name}
      {showIcon && <span className="inline-flex items-center">{icon}</span>}
    </span>
  );
};
