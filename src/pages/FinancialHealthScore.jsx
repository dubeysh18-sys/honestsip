import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import SliderField from '../components/SliderField';
import Select from '../components/Select';
import { computeFinancialHealthScore } from '../lib/benchmarkData';
import { emergencyFundTarget, netWorthBenchmark } from '../lib/ruleEngine';
import { EMERGENCY_FUND_BENCHMARKS } from '../lib/benchmarkData';

const DIMENSIONS = [
  { key: 'savingsRate',     label: 'Savings Rate',         maxPts: 20 },
  { key: 'emergencyFund',   label: 'Emergency Fund',       maxPts: 20 },
  { key: 'debtToIncome',    label: 'Debt-to-Income',       maxPts: 20 },
  { key: 'netWorthVsPeer',  label: 'Net Worth vs Peer',    maxPts: 20 },
  { key: 'insurance',       label: 'Insurance Adequacy',   maxPts: 15 },
  { key: 'financialHygiene',label: 'Financial Hygiene',    maxPts: 5  },
];

export default function FinancialHealthScore() {
  const [monthlyIncome, setIncome]     = useState(75000);
  const [monthlySavings, setSavings]   = useState(15000);
  const [monthlyDebt, setDebt]         = useState(10000);
  const [emergencyMonths, setEFMonths] = useState(2);
  const [empType, setEmpType]          = useState('mid-company');
  const [netWorth, setNetWorth]        = useState(500000);
  const [age, setAge]                  = useState(30);
  const [hasTermIns, setTermIns]       = useState(false);
  const [hasMedIns, setMedIns]         = useState(false);
  const [termAdequate, setTermAdequate] = useState(false);
  const [hasWill, setWill]             = useState(false);
  const [hasNominations, setNomines]   = useState(true);
  const [filesTaxes, setFilesTaxes]    = useState(true);

  const results = useMemo(() => {
    const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0;
    const foir        = monthlyIncome > 0 ? monthlyDebt / monthlyIncome : 0;
    const annualIncome = monthlyIncome * 12;
    const bm          = netWorthBenchmark(age);
    const medianMult  = (bm.medianLow + bm.medianHigh) / 2;
    const nwMult      = annualIncome > 0 ? netWorth / annualIncome : 0;
    const recommended = EMERGENCY_FUND_BENCHMARKS[empType]?.months || 6;

    const score = computeFinancialHealthScore({
      savingsRate,
      emergencyMonths,
      recommendedEFMonths: recommended,
      foir,
      netWorthMultiple: nwMult,
      medianMultiple:   medianMult,
      hasTermInsurance: hasTermIns,
      hasMedicalInsurance: hasMedIns,
      termCoverAdequate: termAdequate,
      hasWill,
      hasNominations,
      filesTaxes,
    });

    // Find weakest dimension
    const dims = DIMENSIONS.map(d => ({
      ...d,
      score:  score.dimensions[d.key],
      pct:    Math.round((score.dimensions[d.key] / d.maxPts) * 100),
    }));
    const weakest = [...dims].sort((a, b) => a.pct - b.pct)[0];

    return { ...score, dims, weakest, savingsRate, foir };
  }, [monthlyIncome, monthlySavings, monthlyDebt, emergencyMonths, empType, netWorth, age,
      hasTermIns, hasMedIns, termAdequate, hasWill, hasNominations, filesTaxes]);

  const gradeColor = { 'A+':'sage-text', 'A':'sage-text', 'B+':'text-warning', 'B':'text-warning', 'C':'text-warning', 'D+':'text-danger', 'D':'text-danger' };

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Financial Health Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Financial Wellness</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Financial Health<br />
            <em className="italic">Score</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            6-dimension composite score. Weighted by real impact, not theoretical benchmarks.
          </p>
        </div>

        <div className="section-card mb-4">
          <NumberInput label="Monthly Take-Home Income"   value={monthlyIncome}   onChange={setIncome} />
          <NumberInput label="Monthly Savings (all forms)" value={monthlySavings} onChange={setSavings} />
          <NumberInput label="Monthly Debt Payments (EMI)" value={monthlyDebt}    onChange={setDebt} />

          <SliderField
            label={`Emergency Fund Coverage`}
            value={emergencyMonths}
            min={0}
            max={24}
            unit=" months"
            onChange={setEFMonths}
          />

          <Select
            label="Employment Type"
            value={empType}
            onChange={setEmpType}
            options={Object.entries(EMERGENCY_FUND_BENCHMARKS).map(([k, b]) => ({ value: k, label: b.label }))}
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="label-overline mb-2">Age</p>
              <div className="flex items-baseline gap-2 border-b border-outline-var/20 focus-within:border-primary pb-1 transition-colors">
                <input
                  type="number"
                  value={age}
                  min={18}
                  max={80}
                  onChange={e => setAge(Number(e.target.value))}
                  className="flex-1 bg-transparent text-on-surface font-serif text-2xl focus:outline-none appearance-none"
                  style={{ fontFamily: 'Newsreader, Georgia, serif' }}
                />
                <span className="font-sans text-on-surface-var text-sm">yrs</span>
              </div>
            </div>
            <NumberInput label="Net Worth (₹)" value={netWorth} onChange={setNetWorth} prefix="₹" />
          </div>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Insurance & Hygiene</p>
          {[
            { label: 'Have Term Insurance?',    value: hasTermIns,    set: setTermIns },
            { label: 'Term Cover Adequate?',    value: termAdequate,  set: setTermAdequate },
            { label: 'Have Health Insurance?',  value: hasMedIns,     set: setMedIns },
            { label: 'Have a Will?',            value: hasWill,       set: setWill },
            { label: 'Nominations Updated?',    value: hasNominations,set: setNomines },
            { label: 'File Taxes Regularly?',   value: filesTaxes,    set: setFilesTaxes },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <p className="text-sm text-on-surface-var">{item.label}</p>
              <button
                className={`toggle-track ${item.value ? 'active' : ''}`}
                onClick={() => item.set(!item.value)}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Financial Health Results">
        {/* Score circle */}
        <div className="section-card mb-4 text-center py-8">
          <p className="label-overline text-on-surface-var mb-3">Your Score</p>
          <div className="relative inline-flex items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgb(var(--color-surface-high))" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="60" fill="none"
                stroke="#ffb77d" strokeWidth="10"
                strokeDasharray={`${(results.total / 100) * 376.99} 376.99`}
                strokeLinecap="round"
                strokeDashoffset="94.25"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className="absolute text-center">
              <p className="font-serif text-4xl text-on-surface">{results.total}</p>
              <p className={`font-sans text-xl font-bold ${gradeColor[results.grade] || 'mango-text'}`}>
                {results.grade}
              </p>
            </div>
          </div>
          <p className="text-sm text-on-surface-var mt-4">
            Savings Rate: <span className="mango-text">{Math.round(results.savingsRate * 100)}%</span> &nbsp;|&nbsp;
            FOIR: <span className={results.foir > 0.5 ? 'text-danger' : 'sage-text'}>{Math.round(results.foir * 100)}%</span>
          </p>
        </div>

        {/* Dimension breakdown */}
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Score Breakdown</p>
          <div className="space-y-3">
            {results.dims.map(d => (
              <div key={d.key}>
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-xs text-on-surface-var">{d.label}</p>
                  <p className="text-sm mango-text font-semibold">{d.score}/{d.maxPts}</p>
                </div>
                <div className="percentile-bar-track">
                  <div className="percentile-bar-fill" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority action */}
        {results.weakest && (
          <div className="cost-of-waiting mt-4">
            <p className="label-overline mb-1 text-primary-container">🎯 Priority Action</p>
            <p className="text-sm text-on-surface">
              Your weakest area is <span className="mango-text font-semibold">{results.weakest.label}</span>{' '}
              ({results.weakest.score}/{results.weakest.maxPts} pts).
              Improving this will have the single biggest impact on your score.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}
