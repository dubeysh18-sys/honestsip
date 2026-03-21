import React, { useState, useEffect } from 'react';
import { sipAmountPercentile, INCOME_PERCENTILES } from '../lib/benchmarkData';
import { formatINR } from '../lib/ruleEngine';

export default function FinancialTwin({ sipAmount, context = 'SIP' }) {
  const [step, setStep] = useState(0); // 0=prompt, 1=question, 2=result, -1=dismissed
  const [bracket, setBracket] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sipAmount || sipAmount <= 0) return;
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1200); // 1.2s delay after result renders
    return () => clearTimeout(timer);
  }, [sipAmount]);

  if (!visible || step === -1 || !sipAmount) return null;

  const handleDismiss = () => setStep(-1);

  if (step === 0) {
    return (
      <div className="glass-card p-4 mt-6 animate-result">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label-overline lavender-text mb-1">👥 Financial Twin</p>
            <p className="text-sm text-on-surface leading-relaxed">
              See how your <span className="mango-text font-semibold">{formatINR(sipAmount)}</span> {context} compares to{' '}
              <span className="mango-text">1,400+ people</span> like you →
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="btn-primary text-xs px-4 py-2 flex-shrink-0"
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
          >
            Unlock
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="text-xs text-on-surface-var opacity-40 mt-3 hover:opacity-70 underline"
        >
          Skip for now
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="glass-card p-5 mt-6 animate-result">
        <p className="font-serif text-xl text-on-surface mb-1">What's your monthly take-home?</p>
        <p className="text-xs text-on-surface-var mb-4 opacity-70">
          This helps calibrate your peer benchmark. We never store this.
        </p>
        <div className="space-y-2">
          {INCOME_PERCENTILES.map((b) => (
            <button
              key={b.bracket}
              onClick={() => { setBracket(b.bracket); setStep(2); }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-on-surface transition-all"
              style={{ background: '#2a2a2a' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#353534'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
            >
              {b.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleDismiss}
          className="text-xs text-on-surface-var opacity-40 mt-4 hover:opacity-70 underline block"
        >
          I'll skip this for now
        </button>
      </div>
    );
  }

  if (step === 2 && bracket) {
    const bm = sipAmountPercentile(bracket, sipAmount);
    const bracketData = INCOME_PERCENTILES.find(b => b.bracket === bracket);

    return (
      <div className="glass-card p-5 mt-6 animate-result">
        <p className="label-overline lavender-text mb-3">👥 Your Financial Twin</p>
        <p className="font-sans text-sm text-on-surface mb-1">
          Using <span className="mango-text">{formatINR(bracketData?.midpoint)}</span> as your income estimate
        </p>

        <div className="inner-card mt-3">
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-xs text-on-surface-var uppercase tracking-wider">Your SIP</p>
            <p className="font-serif text-2xl mango-text">{formatINR(sipAmount)}</p>
          </div>
          <div className="flex justify-between items-baseline mb-3">
            <p className="text-xs text-on-surface-var uppercase tracking-wider">Peer Avg</p>
            <p className="font-serif text-lg lavender-text">{formatINR(bm.peerAvg)}</p>
          </div>

          {/* Percentile bar */}
          <div className="percentile-bar-track mb-1">
            <div
              className="percentile-bar-fill"
              style={{ width: `${bm.percentile}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-on-surface-var opacity-60">0%</p>
            <p className="text-xs mango-text font-semibold">Top {100 - bm.percentile}%</p>
            <p className="text-xs text-on-surface-var opacity-60">100%</p>
          </div>
        </div>

        <p className="text-sm text-on-surface mt-3">
          Your {context} is in the{' '}
          <span className="mango-text font-semibold">top {100 - bm.percentile}%</span> for your income bracket.
          <span className="sage-text ml-1">{bm.label} 🎯</span>
        </p>
      </div>
    );
  }

  return null;
}
