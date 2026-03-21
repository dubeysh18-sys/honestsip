import React, { useState, useEffect, useRef } from 'react';
import { formatINR } from '../lib/ruleEngine';

export default function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  formatValue,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value.toString());
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    let num = Number(localValue);
    if (!isNaN(num)) {
      if (num < min) num = min;
      if (num > max) num = max;
      onChange(num);
      setLocalValue(num.toString());
    } else {
      setLocalValue(value.toString());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const display = formatValue ? formatValue(value) : `${value}${unit}`;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-field mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className="label-overline">{label}</span>
        {isEditing ? (
          <input
            ref={inputRef}
            type="number"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-32 bg-transparent border-b border-mango-text/50 text-right font-serif text-xl text-mango-text outline-none focus:border-mango-accent focus:outline-none focus:ring-0"
            autoFocus
          />
        ) : (
          <span 
            className="font-serif text-xl text-on-surface leading-none mango-text font-light cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsEditing(true)}
            title="Click to manually edit value"
          >
            {display}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #ff8c00 0%, #ffb77d ${pct}%, #353534 ${pct}%, #353534 100%)`,
          }}
          className="w-full"
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-on-surface-var opacity-50">{min}{unit}</span>
        <span className="text-xs text-on-surface-var opacity-50">{max}{unit}</span>
      </div>
    </div>
  );
}
