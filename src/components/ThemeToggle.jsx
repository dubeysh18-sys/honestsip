import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
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
