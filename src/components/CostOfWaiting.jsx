import React from 'react';
import { formatINR } from '../lib/ruleEngine';

export default function CostOfWaiting({ delta, label = 'Every month you delay costs you' }) {
  if (!delta || delta <= 0) return null;

  return (
    <div className="cost-of-waiting mt-6">
      <p className="label-overline mb-1 text-primary-container">⚡ Cost of Waiting</p>
      <p className="text-on-surface font-sans text-sm leading-relaxed">
        {label}{' '}
        <span className="font-serif text-xl mango-text leading-none">
          {formatINR(Math.round(delta))}
        </span>{' '}
        in final corpus.
      </p>
      <p className="text-xs text-on-surface-var opacity-60 mt-1">
        This is the compounding opportunity cost of a single month's delay.
      </p>
    </div>
  );
}
