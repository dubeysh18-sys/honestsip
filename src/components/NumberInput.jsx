import React from 'react';

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
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw ? Number(raw) : 0;
    if (max !== undefined && num > max) return;
    onChange(num);
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
          type="number"
          min={min}
          max={max}
          value={value || ''}
          onChange={handleChange}
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
