import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  isDemo?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon: Icon,
  iconBg = 'bg-indigo-50',
  iconColor = 'text-indigo-600',
  isDemo = false,
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
              {title}
            </span>
            {isDemo && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                Demo
              </span>
            )}
          </div>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
          {changeType === 'positive' ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : changeType === 'negative' ? (
            <TrendingDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          ) : null}
          <span
            className={`font-semibold ${
              changeType === 'positive'
                ? 'text-emerald-700'
                : changeType === 'negative'
                ? 'text-rose-700'
                : 'text-slate-600'
            }`}
          >
            {change}
          </span>
          <span className="text-slate-400">vs last cycle</span>
        </div>
      )}
    </div>
  );
};
