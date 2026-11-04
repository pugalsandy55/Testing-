import React from 'react';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const AtsGauge: React.FC<Props> = ({ score, size = 'md', showLabel = true }) => {
  const getColors = () => {
    if (score >= 80) return { stroke: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Strong Pass' };
    if (score >= 60) return { stroke: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Moderate' };
    return { stroke: '#EF4444', bg: 'bg-rose-50', text: 'text-rose-700', label: 'Action Required' };
  };

  const { stroke, bg, text, label } = getColors();

  const dimensions = {
    sm: { width: 48, radius: 18, strokeWidth: 4, font: 'text-xs' },
    md: { width: 88, radius: 34, strokeWidth: 7, font: 'text-xl' },
    lg: { width: 140, radius: 56, strokeWidth: 10, font: 'text-3xl' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg width={dimensions.width} height={dimensions.width} className="-rotate-90">
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke="#E2E8F0"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            stroke={stroke}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-extrabold text-slate-900 ${dimensions.font}`}>
            {score}
          </span>
          {size === 'lg' && <span className="text-[10px] text-slate-400 font-semibold uppercase">out of 100</span>}
        </div>
      </div>
      {showLabel && (
        <span className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${bg} ${text}`}>
          {label}
        </span>
      )}
    </div>
  );
};
