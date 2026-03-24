import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Editorial Select — Matches NumberInput styling
 *
 * Props:
 *   label     — overline label shown above the trigger
 *   value     — currently selected value
 *   onChange  — callback(value) when selection changes
 *   options          — [{ value, label, sublabel? }]
 *   portaled         — when true, menu renders in a fixed layer (escapes overflow:hidden)
 *                      and sizes to the widest option, aligned under this field’s trigger.
 *   wrapperClassName — root div classes (default mb-5); use mb-0 shrink-0 min-w-[…] beside inputs.
 *   ariaLabel        — aria-label on trigger when there is no visible label.
 */
export default function Select({
  label,
  value,
  onChange,
  options = [],
  portaled = false,
  wrapperClassName = 'mb-5',
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuPanelRef = useRef(null);
  const [fixedMenuStyle, setFixedMenuStyle] = useState(null);

  useLayoutEffect(() => {
    if (!open || !portaled) {
      setFixedMenuStyle(null);
      return;
    }
    const trigger = triggerRef.current;
    if (!trigger) {
      setFixedMenuStyle(null);
      return;
    }

    const computeStyle = () => {
      const t = trigger.getBoundingClientRect();
      const top = t.bottom + 12;
      let left = t.left;
      const pad = 12;
      const el = menuPanelRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0) {
          if (r.right > window.innerWidth - pad) {
            left += window.innerWidth - pad - r.right;
          }
          if (left < pad) left = pad;
        }
      }
      return { position: 'fixed', top, left, zIndex: 100 };
    };

    const update = () => setFixedMenuStyle(computeStyle());

    update();
    const id = requestAnimationFrame(() => update());

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, portaled]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inRoot = rootRef.current?.contains(e.target);
      const inMenu = menuPanelRef.current?.contains(e.target);
      if (!inRoot && !inMenu) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = options.find((o) => o.value === value) || options[0];

  const menuShellClass =
    'overflow-hidden rounded-xl border border-outline-var/20 bg-surface-high shadow-2xl animate-fade-in inline-flex max-w-[calc(100vw-1.5rem)] flex-col items-stretch w-max';

  const optionList = options.map((opt) => {
    const isSelected = opt.value === value;
    return (
      <button
        key={opt.value}
        type="button"
        onClick={() => {
          onChange(opt.value);
          setOpen(false);
        }}
        className={`cursor-pointer border-b border-outline-var/10 px-4 py-2.5 text-left transition-colors last:border-b-0 ${
          isSelected
            ? 'border-l-2 border-primary bg-primary/10'
            : 'border-l-2 border-transparent hover:bg-surface-highest'
        }`}
      >
        <span
          className={`block font-serif text-[0.9375rem] leading-snug ${
            isSelected ? 'text-on-surface' : 'text-on-surface-var'
          } ${opt.sublabel ? '' : 'whitespace-nowrap'}`}
          style={{ fontFamily: 'Newsreader, Georgia, serif' }}
        >
          {opt.label}
        </span>
        {opt.sublabel && (
          <span className="label-overline mt-1 block text-on-surface-var opacity-50">
            {opt.sublabel}
          </span>
        )}
      </button>
    );
  });

  return (
    <div className={wrapperClassName} ref={rootRef} style={{ position: 'relative' }}>
      {label ? <p className="label-overline mb-2">{label}</p> : null}

      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full min-w-0 cursor-pointer items-baseline justify-between gap-2 border-b pb-1 text-left transition-colors focus:outline-none ${
          open
            ? 'border-primary'
            : 'border-outline-var/20 hover:border-outline-var/50'
        }`}
      >
        <span
          className="min-w-0 flex-1 truncate bg-transparent font-serif text-base text-on-surface"
          style={{ fontFamily: 'Newsreader, Georgia, serif' }}
        >
          {selected?.label}
        </span>
        <span
          className="mango-text shrink-0 text-base"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
          }}
        >
          ▾
        </span>
      </button>

      {open && !portaled && (
        <div
          ref={menuPanelRef}
          className={`absolute left-0 top-full z-50 mt-3 ${menuShellClass}`}
        >
          {optionList}
        </div>
      )}

      {open &&
        portaled &&
        fixedMenuStyle &&
        createPortal(
          <div
            ref={menuPanelRef}
            className={menuShellClass}
            style={fixedMenuStyle}
          >
            {optionList}
          </div>,
          document.body
        )}
    </div>
  );
}
