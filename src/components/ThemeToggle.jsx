import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-10 h-10 flex flex-col items-center justify-center rounded-full bg-surface-highest text-on-surface hover:bg-primary/20 transition-colors shadow-sm"
      aria-label="Toggle Theme"
      title="Toggle Light/Dark Mode"
    >
      <span className="text-xl leading-none" style={{ transform: 'translateY(1px)' }}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
