import React, { useState, useMemo, useRef } from 'react';
import NumberInput from '../components/NumberInput';
import SliderField from '../components/SliderField';
import { netWorthBenchmark, formatINR, formatINRLakh } from '../lib/ruleEngine';
import { INCOME_PERCENTILES, EMERGENCY_FUND_BENCHMARKS } from '../lib/benchmarkData';

const AGE_MILESTONES = [
  { age: 25, target: 0.5,  label: '0.5× annual income saved' },
  { age: 30, target: 1.5,  label: '1.5× annual income saved' },
  { age: 35, target: 3.0,  label: '3× annual income saved' },
  { age: 40, target: 5.0,  label: '5× annual income saved' },
  { age: 45, target: 7.0,  label: '7× annual income saved' },
  { age: 50, target: 10.0, label: '10× annual income saved' },
  { age: 55, target: 14.0, label: '14× annual income saved' },
  { age: 60, target: 18.0, label: '18× — Retirement Target' },
];

function getMilestoneTarget(age) {
  if (age <= 25) return 0.5;
  if (age >= 60) return 18.0;
  for (let j = 0; j < AGE_MILESTONES.length - 1; j++) {
    const lo = AGE_MILESTONES[j], hi = AGE_MILESTONES[j + 1];
    if (age >= lo.age && age <= hi.age) {
      const t = (age - lo.age) / (hi.age - lo.age);
      return lo.target + t * (hi.target - lo.target);
    }
  }
  return 18.0;
}

function getStatus(actual, target) {
  if (actual >= target * 1.0)        return { label: '✅ On Track', cls: 'badge-green',  color: '#4caf82' };
  if (actual >= target * 0.7)        return { label: '⚡ Almost',   cls: 'badge-yellow', color: '#f5c842' };
  return                                    { label: '⚠️ Behind',   cls: 'badge-red',    color: '#e05252' };
}

const DIMENSIONS = [
  { key: 'netWorth',     label: 'Net Worth vs Peer',  icon: '💰' },
  { key: 'savingsRate',  label: 'Savings Rate',        icon: '📈' },
  { key: 'emergencyFund',label: 'Emergency Fund',      icon: '🛡️' },
  { key: 'debtLoad',     label: 'Debt Load',           icon: '📉' },
  { key: 'sipAdequacy',  label: 'SIP Adequacy',        icon: '🎯' },
];

export default function OnTrack() {
  const [age, setAge]              = useState(30);
  const [annualIncome, setIncome]  = useState(900000);
  const [netWorth, setNetWorth]    = useState(500000);
  const [savingsRate, setSavings]  = useState(15);
  const [efMonths, setEfMonths]    = useState(2);
  const [foir, setFoir]            = useState(25);
  const [monthlySIP, setSip]       = useState(5000);
  const [empType, setEmpType]      = useState('mid-company');

  const cardRef = useRef(null);

  const results = useMemo(() => {
    const annualIncomeTH = annualIncome;
    const milestone      = getMilestoneTarget(age);
    const nwActualMult   = annualIncomeTH > 0 ? netWorth / annualIncomeTH : 0;
    const bm             = netWorthBenchmark(age);
    const recommendedEF  = EMERGENCY_FUND_BENCHMARKS[empType]?.months || 6;

    const monthlyIncome  = annualIncomeTH / 12;
    // Recommended SIP: ~15-20% of income
    const recommendedSIP = monthlyIncome * 0.20;
    const sipRatio       = recommendedSIP > 0 ? monthlySIP / recommendedSIP : 0;

    const dims = {
      netWorth:     getStatus(nwActualMult,    milestone),
      savingsRate:  getStatus(savingsRate,     20),       // target 20%
      emergencyFund:getStatus(efMonths,        recommendedEF),
      debtLoad:     getStatus(50 - foir,       50 - 40), // debt < 40% is good
      sipAdequacy:  getStatus(sipRatio * 20,   20),       // normalize to 0-20 scale
    };

    const greenCount  = Object.values(dims).filter(d => d.label.includes('✅')).length;
    const overallPct  = Math.round((greenCount / 5) * 100);
    const overallGrade = overallPct >= 80 ? 'On Track 🟢' : overallPct >= 60 ? 'Almost There 🟡' : 'Needs Attention 🔴';

    return { dims, milestone, nwActualMult: Math.round(nwActualMult * 10) / 10,
      medianLow: bm.medianLow, medianHigh: bm.medianHigh,
      greenCount, overallPct, overallGrade, recommendedEF, recommendedSIP: Math.round(recommendedSIP) };
  }, [age, annualIncome, netWorth, savingsRate, efMonths, foir, monthlySIP, empType]);

  const handleExportCard = () => {
    import('html2canvas').then(({ default: html2canvas }) => {
      if (!cardRef.current) return;
      html2canvas(cardRef.current, {
        backgroundColor: '#131313',
        scale: 2,
        useCORS: true,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'honestsip-financial-twin.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  };

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="On Track Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Financial Audit</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Am I On<br />
            <em className="italic">Track?</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            5-dimension Red / Yellow / Green verdicts. India-specific peer benchmarks, not American studies.
          </p>
        </div>

        <div className="section-card mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="label-overline mb-1">Your Age</p>
              <input type="number" value={age} min={18} max={70}
                onChange={e => setAge(Number(e.target.value))} className="input-ghost text-center" />
            </div>
            <NumberInput label="Annual Income (₹)" value={annualIncome} onChange={setIncome} prefix="₹" />
          </div>

          <NumberInput label="Current Net Worth" value={netWorth} onChange={setNetWorth}
            hint="Total assets minus all liabilities" />

          <SliderField label="Monthly Savings Rate" value={savingsRate} min={0} max={80} unit="%" onChange={setSavings} />
          <SliderField label="Emergency Fund Coverage" value={efMonths} min={0} max={24} unit=" months" onChange={setEfMonths} />
          <SliderField label="Debt / EMI Burden (FOIR)" value={foir} min={0} max={80} unit="%" onChange={setFoir} />

          <NumberInput label="Monthly SIP Amount" value={monthlySIP} onChange={setSip} />

          <div className="mb-4">
            <p className="label-overline mb-2">Employment Type</p>
            <select className="select-ghost" value={empType} onChange={e => setEmpType(e.target.value)}>
              {Object.entries(EMERGENCY_FUND_BENCHMARKS).map(([k, b]) => (
                <option key={k} value={k}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section aria-label="On Track Results">
        {/* Shareable Financial Twin Card */}
        <div ref={cardRef} className="section-card mb-4" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-on-surface-var opacity-50 letter-spacing-widest uppercase tracking-widest">honestsip.in</p>
              <p className="font-serif text-2xl text-on-surface">Financial Twin</p>
            </div>
            <div className="text-right">
              <p className="text-5xl mango-text">{results.overallPct}%</p>
              <p className="text-xs text-on-surface-var">on-track score</p>
            </div>
          </div>

          <p className="text-sm text-on-surface-var mb-4">{results.overallGrade}</p>

          {/* 5-dimension grid */}
          <div className="space-y-3">
            {DIMENSIONS.map(d => {
              const dim = results.dims[d.key];
              return (
                <div key={d.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{d.icon}</span>
                    <p className="text-sm text-on-surface-var">{d.label}</p>
                  </div>
                  <span className={dim.cls}>{dim.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(86,67,52,0.15)' }}>
            <p className="text-xs text-on-surface-var">
              Age {age} milestone: <span className="mango-text font-semibold">{results.milestone.toFixed(1)}×</span> annual income
              &nbsp;|&nbsp; Your multiple: <span className={results.nwActualMult >= results.milestone ? 'sage-text' : 'text-danger'}>
                {results.nwActualMult}×
              </span>
            </p>
            <p className="text-xs text-on-surface-var opacity-40 mt-1">
              Benchmarks: Fidelity milestones adapted for India (WID India 2024, RBI FSR). honestsip.in
            </p>
          </div>
        </div>

        {/* Age milestone table */}
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-3">Age Milestones</p>
          <div className="space-y-1">
            {AGE_MILESTONES.map(m => {
              const isCurrent = Math.abs(m.age - age) < 5;
              return (
                <div key={m.age}
                  className="flex justify-between items-center py-2 px-3 rounded-lg"
                  style={{ background: isCurrent ? 'rgba(255,183,125,0.08)' : 'transparent' }}>
                  <p className={`text-sm ${isCurrent ? 'mango-text font-semibold' : 'text-on-surface-var'}`}>
                    Age {m.age} {isCurrent ? '← You' : ''}
                  </p>
                  <p className={`text-sm ${isCurrent ? 'mango-text' : 'text-on-surface-var opacity-60'}`}>
                    {m.label}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-on-surface-var opacity-40 mt-3">
            Adapted from Fidelity milestones, calibrated for Indian income levels and savings rates.
          </p>
        </div>

        {/* Export Card button */}
        <button onClick={handleExportCard} className="btn-primary w-full justify-center mb-4">
          📤 Download Financial Twin Card
        </button>

        <div className="glass-card p-4">
          <p className="label-overline lavender-text mb-2">Share on LinkedIn</p>
          <p className="text-xs text-on-surface-var leading-relaxed">
            "Just checked my financial health on HonestSIP.in — {results.overallGrade}.
            At age {age} with a {results.nwActualMult}× net worth multiple.
            The only honest finance calculator I've found for India 🇮🇳 #PersonalFinance #SIP"
          </p>
        </div>

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          Peer benchmarks from Fidelity milestones adapted for India, WID India 2024, RBI FSR.
          Individual results may vary significantly. For educational purposes only.
        </p>
      </section>
    </div>
  );
}
