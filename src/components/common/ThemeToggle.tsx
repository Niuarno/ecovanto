import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC<{ variant?: 'minimal' | 'full' | 'compact' }> = ({
  variant = 'compact',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        data-cursor="link"
        className="p-1.5 hover:opacity-80 transition-opacity text-foreground flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider"
        title={`Switch to ${isDark ? 'Chalk / Light' : 'Noir / Dark'} mode`}
        aria-label="Toggle Theme Swatch"
      >
        {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isDark ? 'CHALK' : 'NOIR'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      data-cursor="link"
      className="group inline-flex items-center space-x-1.5 p-1 border border-border bg-surface hover:border-border-strong transition-all select-none text-xs font-mono tracking-wider uppercase"
      aria-label="Toggle Color Palette"
    >
      {/* Noir Segment */}
      <span
        className={`px-2 py-0.5 text-[10px] transition-colors flex items-center space-x-1 ${
          isDark
            ? 'bg-foreground text-background font-semibold'
            : 'text-muted hover:text-foreground'
        }`}
      >
        <Moon className="w-2.5 h-2.5" />
        <span>NOIR</span>
      </span>

      {/* Chalk Segment */}
      <span
        className={`px-2 py-0.5 text-[10px] transition-colors flex items-center space-x-1 ${
          !isDark
            ? 'bg-foreground text-background font-semibold'
            : 'text-muted hover:text-foreground'
        }`}
      >
        <Sun className="w-2.5 h-2.5" />
        <span>CHALK</span>
      </span>
    </button>
  );
};
