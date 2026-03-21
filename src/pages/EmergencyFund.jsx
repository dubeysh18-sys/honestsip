import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import { emergencyFundTarget, formatINR, formatINRLakh } from '../lib/ruleEngine';
import { EMERGENCY_FUND_BENCHMARKS } from '../lib/benchmarkData';

export default function EmergencyFund() {
  const [monthlyExpense, setMonthly]      = useState(50000);
  const [employmentType, setEmpType]       = useState('mid-company');
  const [hasHealthIns, setHealthIns]       = useState(false);
  const [currentSavings, setCurrentSaving] = useState(0);

  const results = useMemo(() => {
    const { recommendedMonths, targetAmount } = emergencyFundTarget(
      monthlyExpense,
      employmentType,
      hasHealthIns,
    );
    const gap = Math.max(0, targetAmount - currentSavings);
    const coverageMonths = monthlyExpense > 0 ? currentSavings / monthlyExpense : 0;
    return { recommendedMonths, targetAmount, gap, coverageMonths: Math.round(coverageMonths * 10) / 10 };
  }, [monthlyExpense, employmentType, hasHealthIns, currentSavings]);

  const benchmark = EMERGENCY_FUND_BENCHMARKS[employmentType];
  const coverageStatus = results.coverageMonths >= results.recommendedMonths ? 'green'
    : results.coverageMonths >= results.recommendedMonths * 0.5 ? 'yellow' : 'red';

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Emergency Fund Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Financial Safety Net</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Emergency Fund<br />
            <em className="italic">Calculator</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Your safety net — sized to your employment risk, not a generic "3 months" rule.
          </p>
        </div>

        <div className="section-card mb-4">
          <NumberInput
            label="Monthly Expenses"
            value={monthlyExpense}
            onChange={setMonthly}
            hint="Include EMIs, rent, groceries, utilities — all essential outflows"
          />

          <div className="mb-5">
            <p className="label-overline mb-3">Employment Type</p>
            <div className="space-y-2">
              {Object.entries(EMERGENCY_FUND_BENCHMARKS).map(([key, b]) => (
                <button
                  key={key}
                  onClick={() => setEmpType(key)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center border ${
                    employmentType === key 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-surface-high border-transparent'
                  }`}
                >
                  <div>
                    <p className="text-sm text-on-surface font-medium">{b.label}</p>
                    <p className="text-xs text-on-surface-var opacity-60">{b.rationale}</p>
                  </div>
                  <span className="mango-text text-sm font-bold flex-shrink-0 ml-3">{b.months}mo</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="label-overline">Personal Health Insurance?</p>
              <p className="text-xs text-on-surface-var opacity-60 mt-0.5">+2 months buffer if no cover</p>
            </div>
            <button
              className={`toggle-track ${hasHealthIns ? 'active' : ''}`}
              onClick={() => setHealthIns(!hasHealthIns)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          <NumberInput
            label="Current Emergency Savings"
            value={currentSavings}
            onChange={setCurrentSaving}
            hint="Money in savings account / liquid FD earmarked for emergencies"
          />
        </div>
      </section>

      <section aria-label="Emergency Fund Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-1">Emergency Fund Target</p>
          <p className="result-amount animate-result">{formatINR(results.targetAmount)}</p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            {results.recommendedMonths} months of expenses
            {!hasHealthIns ? ' (+2 months — no health insurance)' : ''}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Current Coverage</p>
              <p className={`result-amount-sm ${
                coverageStatus === 'green' ? 'sage-text' :
                coverageStatus === 'yellow' ? 'text-warning' : 'text-danger'
              }`}>{results.coverageMonths} months</p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Gap to Target</p>
              <p className="result-amount-sm">{results.gap > 0 ? formatINRLakh(results.gap) : '✅ Fully funded'}</p>
            </div>
          </div>

          {/* Coverage meter */}
          <div className="mt-4">
            <p className="label-overline text-on-surface-var mb-2">Coverage Progress</p>
            <div className="percentile-bar-track">
              <div
                className="percentile-bar-fill"
                style={{
                  width: `${Math.min(100, (results.coverageMonths / results.recommendedMonths) * 100)}%`,
                  background: coverageStatus === 'green'
                    ? 'linear-gradient(90deg, #4caf82, #bdcca3)'
                    : 'linear-gradient(90deg, #ffb77d, #ff8c00)',
                }}
              />
            </div>
            <p className={`text-xs mt-1 ${
              coverageStatus === 'green' ? 'sage-text' :
              coverageStatus === 'yellow' ? 'text-warning' : 'text-danger'
            }`}>
              {coverageStatus === 'green'
                ? `✅ You're on track! ${results.coverageMonths}/${results.recommendedMonths} months covered.`
                : `⚠️ Build towards ${results.recommendedMonths} months. RBI FSR: most households have <2 months.`}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 mt-4">
          <p className="label-overline lavender-text mb-2">📌 Peer Context</p>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Most Indian households hold less than 2 months of emergency buffer (RBI Financial Stability Report).
            For <span className="text-on-surface font-medium">{benchmark?.label}</span>, the recommended minimum is{' '}
            <span className="mango-text font-semibold">{benchmark?.months} months</span>.
          </p>
        </div>

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          Source: RBI FSR guidance + standard personal finance practice.
          Emergency fund should be in liquid instruments: savings account, liquid MF, short-term FD.
        </p>
      </section>
    </div>
  );
}
