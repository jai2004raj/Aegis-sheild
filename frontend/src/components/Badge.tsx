import React from 'react';

interface BadgeProps {
  status: string;
  variant?: 'solid' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (['ACTIVE', 'PRESENT', 'APPROVED', 'PAID', 'RESOLVED'].includes(normalized)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30';
  } else if (['PENDING', 'NEW', 'PROCESSING', 'LATE', 'ON_LEAVE'].includes(normalized)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
  } else if (['INACTIVE', 'ABSENT', 'REJECTED', 'CANCELLED', 'CLOSED'].includes(normalized)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';
  } else if (['TRANSFERRED', 'COMPLETED', 'CONTACTED'].includes(normalized)) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${styles} transition-colors`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
      {status}
    </span>
  );
};
