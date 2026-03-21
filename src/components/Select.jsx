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
          className="absolute left-0 right-0 mt-3 rounded-xl z-50 overflow-hidden shadow-2xl animate-fade-in"
          style={{
            top: '100%',
            background: '#2a2a2a',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: isSelected ? 'rgba(255,183,125,0.08)' : 'transparent',
                  borderLeft: isSelected ? '2px solid #ffb77d' : '2px solid transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>
                  <span
                    className={`font-serif text-lg ${isSelected ? 'text-on-surface' : 'text-on-surface-var'}`}
                    style={{ fontFamily: 'Newsreader, Georgia, serif', display: 'block', lineHeight: 1.2 }}
                  >
                    {opt.label}
                  </span>
                  {opt.sublabel && (
                    <span
                      className="label-overline text-on-surface-var"
                      style={{ opacity: 0.5, display: 'block', marginTop: '0.25rem' }}
                    >
                      {opt.sublabel}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    color: isSelected ? '#ffb77d' : 'rgba(221,193,174,0.3)',
                    marginLeft: '0.75rem',
                    flexShrink: 0,
                  }}
                >
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
