import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Day Shift' : 'Switch to Night Watch'}
      title={isDark ? 'Switch to Day Shift' : 'Switch to Night Watch'}
      className={`tactile-btn px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-[var(--bg-surface)] text-[var(--text-main)] border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] flex items-center gap-2 ${className}`}
    >
      <span className="text-sm select-none" aria-hidden="true">
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="font-mono uppercase text-[11px] tracking-wider font-bold">
        {isDark ? 'NIGHT WATCH' : 'DAY SHIFT'}
      </span>
    </button>
  );
};
