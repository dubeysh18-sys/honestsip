import React, { useState, useRef, useEffect } from 'react';

/**
 * Editorial Select — Matches NumberInput styling
 *
 * Props:
 *   label    — overline label shown above the trigger
 *   value    — currently selected value
 *   onChange — callback(value) when selection changes
 *   options  — [{ value, label, sublabel? }]
 */
export default function Select({ label, value, onChange, options = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="mb-5" ref={ref} style={{ position: 'relative' }}>
      {label && (
        <p className="label-overline mb-2">{label}</p>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-baseline justify-between border-b pb-1 transition-colors cursor-pointer text-left focus:outline-none ${open ? 'border-primary' : 'border-outline-var/20 hover:border-outline-var/50'}`}
      >
        <span
          className="bg-transparent text-on-surface font-serif text-2xl"
          style={{ fontFamily: 'Newsreader, Georgia, serif' }}
        >
          {selected?.label}
        </span>
        <span
          className="mango-text text-lg"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 right-0 mt-3 rounded-xl z-50 overflow-hidden shadow-2xl animate-fade-in bg-surface-high border border-outline-var/20"
          style={{ top: '100%' }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer transition-colors border-b border-outline-var/10 ${
                  isSelected 
                    ? 'bg-primary/10 border-l-2 border-primary' 
                    : 'bg-transparent border-l-2 border-transparent hover:bg-surface-highest'
                }`}
              >
                <span>
                  <span className={`font-serif text-lg block leading-snug ${isSelected ? 'text-on-surface' : 'text-on-surface-var'}`}>
                    {opt.label}
                  </span>
                  {opt.sublabel && (
                    <span className="label-overline text-on-surface-var opacity-50 block mt-1">
                      {opt.sublabel}
                    </span>
                  )}
                </span>
                <span className={`text-base ml-3 shrink-0 ${isSelected ? 'text-primary' : 'text-on-surface-var opacity-30'}`}>
                  {isSelected ? '✓' : '→'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
