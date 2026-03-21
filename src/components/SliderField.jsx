import React from 'react';
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
  const display = formatValue ? formatValue(value) : `${value}${unit}`;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-field mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className="label-overline">{label}</span>
        <span className="font-serif text-xl text-on-surface leading-none mango-text font-light">
          {display}
        </span>
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
