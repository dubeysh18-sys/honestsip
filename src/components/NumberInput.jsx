import React, { useState, useEffect, useRef } from 'react';

export default function NumberInput({
  label,
  value,
  onChange,
  prefix = '₹',
  min = 0,
  max,
  placeholder = '0',
  hint,
}) {
  const [localValue, setLocalValue] = useState(value === 0 ? '' : String(value));
  const isFocused = useRef(false);

  // Sync external value changes (e.g. reset) only when not actively editing
  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value === 0 ? '' : String(value));
    }
  }, [value]);

  const handleFocus = (e) => {
    isFocused.current = true;
    // Select all text so typing immediately replaces the existing value
    e.target.select();
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setLocalValue(raw);
    const num = raw ? Number(raw) : 0;
    if (max !== undefined && num > max) return;
    onChange(num);
  };

  const handleBlur = () => {
    isFocused.current = false;
    // If field left empty, revert display to current value (keep 0 as empty display)
    setLocalValue(value === 0 ? '' : String(value));
  };

  return (
    <div className="mb-5">
      <p className="label-overline mb-2">{label}</p>
      <div className="flex items-baseline gap-2 border-b border-outline-var/20 focus-within:border-primary pb-1 transition-colors">
        {prefix && (
          <span className="font-sans text-on-surface-var text-lg">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={max}
          value={localValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-on-surface font-serif text-2xl focus:outline-none appearance-none"
          style={{ fontFamily: 'Newsreader, Georgia, serif' }}
        />
      </div>
      {hint && (
        <p className="text-xs text-on-surface-var opacity-50 mt-1">{hint}</p>
      )}
    </div>
  );
}
