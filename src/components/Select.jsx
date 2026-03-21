import React, { useState, useRef, useEffect } from 'react';

/**
 * Editorial Select — Midnight Mango design language
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
    <div className="mb-4" ref={ref} style={{ position: 'relative' }}>
      {label && (
        <p className="label-overline mb-2">{label}</p>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1c1b1b',
          borderRadius: '1rem',
          padding: '0.875rem 1.25rem',
          border: open ? '1px solid rgba(255,183,125,0.25)' : '1px solid transparent',
          transition: 'border-color 0.2s',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          className="font-serif italic text-on-surface"
          style={{ fontSize: '1.1rem', lineHeight: 1.2 }}
        >
          {selected?.label}
        </span>
        {/* Chevron */}
        <span
          style={{
            display: 'inline-block',
            color: '#ffb77d',
            fontSize: '0.75rem',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            marginLeft: '0.75rem',
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.25rem)',
            left: 0,
            right: 0,
            background: '#2a2a2a',
            borderRadius: '0.75rem',
            zIndex: 50,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
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
                  padding: '0.875rem 1.25rem',
                  background: isSelected ? 'rgba(255,183,125,0.08)' : 'transparent',
                  borderLeft: isSelected ? '2px solid #ffb77d' : '2px solid transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
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
                    className="font-serif italic text-on-surface"
                    style={{ fontSize: '1rem', display: 'block', lineHeight: 1.2 }}
                  >
                    {opt.label}
                  </span>
                  {opt.sublabel && (
                    <span
                      className="label-overline text-on-surface-var"
                      style={{ opacity: 0.5, display: 'block', marginTop: '0.15rem' }}
                    >
                      {opt.sublabel}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: isSelected ? '#ffb77d' : 'rgba(221,193,174,0.35)',
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
