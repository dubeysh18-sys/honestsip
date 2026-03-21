import React, { useState, useMemo } from 'react';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import Select from '../components/Select';
import CostOfWaiting from '../components/CostOfWaiting';
import FinancialTwin from '../components/FinancialTwin';
import {
  monthlyRate, reverseSIP, reverseStepUpSIP, inflationAdjustedGoal,
  taxEngine, stepUpSIPFV, sipFV, totalInvestedStepUp, totalInvestedFlat,
  formatINR, formatINRLakh, costOfWaiting,
} from '../lib/ruleEngine';

const TAX_TYPES = [
  { value: 'equity-ltcg', label: 'LTCG – Equity (12.5%)', assetClass: 'equity', holding: 5 },
  { value: 'equity-stcg', label: 'STCG – Equity (20%)',   assetClass: 'equity', holding: 0.5 },
  { value: 'debt',        label: 'Debt Fund (Slab Rate)', assetClass: 'debt',   holding: 5 },
];

export default function ReverseSIP() {
  const [goal, setGoal]         = useState(5000000);
  const [years, setYears]       = useState(10);
  const [rate, setRate]         = useState(12);
  const [inflation, setInflation] = useState(6);
  const [inflateGoal, setInflateGoal] = useState(true);
  const [taxType, setTaxType]   = useState('equity-ltcg');
  const [exitLoad, setExitLoad] = useState(1);
  const [lumpSum, setLumpSum]   = useState(0);
  const [stepUp, setStepUp]     = useState(10);
  const [freq, setFreq]         = useState('monthly');

  const results = useMemo(() => {
    const r = rate / 100;
    const inf = inflation / 100;
    const g = stepUp / 100;
    const el = exitLoad / 100;
    const n = years * 12;
    const i = monthlyRate(r);

    // Effective goal: inflate if toggle ON
    const goalAdjusted = inflateGoal ? inflationAdjustedGoal(goal, inf, years) : goal;

    // Tax gross-up: how much we need pre-tax to land on goalAdjusted post-tax
    const selectedTax = TAX_TYPES.find(t => t.value === taxType) || TAX_TYPES[0];

    // Exit load reduces effective corpus
    const goalAfterExitLoad = goalAdjusted / (1 - el);

    // Required corpus before tax — iterative solve
    // We need: fvGross - tax(fvGross - totalInvested) = goalAfterExitLoad
    // Approximate: fvGross ≈ goalAfterExitLoad + expected_tax
    // For LTCG equity, effective tax rate is roughly: 12.5% × 1.04 × (1 - 125000/gains)
    // We'll do a simple gross-up
    let goalPreTax = goalAfterExitLoad;
    if (selectedTax.assetClass === 'equity' && selectedTax.holding > 1) {
      // Iterative gross-up: assume ~10% effective tax on gains
      goalPreTax = goalAfterExitLoad / 0.93;
    } else if (selectedTax.assetClass === 'equity') {
      goalPreTax = goalAfterExitLoad / (1 - 0.20 * 1.04 * 0.5); // rough 50% gains ratio
    }

    // Lump sum contribution
    const lumpFV = lumpSum > 0 ? lumpSum * Math.pow(1 + i, n) : 0;
    const netGoal = Math.max(0, goalPreTax - lumpFV);

    // Required flat SIP
    const flatSIP = netGoal > 0 ? Math.ceil(reverseSIP(netGoal, i, n)) : 0;

    // Required step-up SIP
    const stepUpSIP = netGoal > 0 ? reverseStepUpSIP(netGoal, g, r, years) : 0;

    // Total to be invested (flat)
    const totalFlatInvested = flatSIP * n + lumpSum;
    const totalStepUpInvested = totalInvestedStepUp(stepUpSIP, g, years) + lumpSum;

    // Verify: compute actual FV of step-up SIP
    const stepUpFV = stepUpSIPFV(stepUpSIP, g, r, years);
    const flatFV   = sipFV(flatSIP, i, n);

    // Starting 1 month later means SIP must increase by:
    const cowFlat   = costOfWaiting(flatSIP, r, n, 0);
    const reqSIPLaterFlat = reverseSIP(goalPreTax, i, n - 1);
    const sipIncrease = Math.max(0, Math.ceil(reqSIPLaterFlat - flatSIP));

    return {
      goalAdjusted:          Math.round(goalAdjusted),
      goalAfterExitLoad:     Math.round(goalAfterExitLoad),
      goalPreTax:            Math.round(goalPreTax),
      flatSIP,
      stepUpSIP,
      totalFlatInvested:     Math.round(totalFlatInvested),
      totalStepUpInvested:   Math.round(totalStepUpInvested),
      sipIncrease,
      flatFV:                Math.round(flatFV),
      stepUpFV:              Math.round(stepUpFV),
    };
  }, [goal, years, rate, inflation, inflateGoal, taxType, exitLoad, lumpSum, stepUp, freq]);

  const selectedTax = TAX_TYPES.find(t => t.value === taxType) || TAX_TYPES[0];

  return (
    <div className="page-section pb-28 md:pb-12">
      {/* Left — Inputs */}
      <section aria-label="Reverse SIP Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Wealth Engineering</p>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-3 leading-tight">
            The Reverse<br />
            <em className="italic">Wealth Architect</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Define your endgame. We calculate the monthly precision required to reach your final financial milestone.
          </p>
        </div>

        <div className="section-card mb-4">
          <NumberInput
            label="Target Goal Amount (₹)"
            value={goal}
            onChange={setGoal}
            hint="Your desired corpus at the end of investment"
          />

          <SliderField
            label="Investment Horizon"
            value={years}
            min={1}
            max={40}
            unit=" yrs"
            onChange={setYears}
          />

          <SliderField
            label="Expected Returns"
            value={rate}
            min={1}
            max={30}
            unit="%"
            onChange={setRate}
          />

          <SliderField
            label="Annual Step-Up (for step-up SIP)"
            value={stepUp}
            min={0}
            max={30}
            unit="%"
            onChange={setStepUp}
          />

          <SliderField
            label="Inflation Rate"
            value={inflation}
            min={1}
            max={15}
            unit="%"
            onChange={setInflation}
          />

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-overline">Inflate Goal Too?</p>
              <p className="text-xs text-on-surface-var opacity-60 mt-0.5">Adjusts target for inflation</p>
            </div>
            <button
              className={`toggle-track ${inflateGoal ? 'active' : ''}`}
              onClick={() => setInflateGoal(!inflateGoal)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">HonestSIP Configuration</p>

          <Select
            label="Taxation Regime"
            value={taxType}
            onChange={setTaxType}
            options={TAX_TYPES.map(t => ({ value: t.value, label: t.label }))}
          />

          <Select
            label="Asset Class"
            value="equity"
            onChange={() => {}}
            options={[{ value: 'equity', label: 'Equity Mutual Funds' }]}
          />

          <SliderField
            label="Exit Load"
            value={exitLoad}
            min={0}
            max={5}
            step={0.5}
            unit="%"
            onChange={setExitLoad}
          />

          <NumberInput
            label="Starting Lump Sum (Optional)"
            value={lumpSum}
            onChange={setLumpSum}
          />

          {/* Frequency */}
          <div className="flex gap-2 mt-2">
            <button className={`freq-btn ${freq === 'monthly' ? 'active' : 'inactive'}`} onClick={() => setFreq('monthly')}>Monthly</button>
            <button className={`freq-btn ${freq === 'quarterly' ? 'active' : 'inactive'}`} onClick={() => setFreq('quarterly')}>Quarterly</button>
          </div>
        </div>
      </section>

      {/* Right — Results */}
      <section aria-label="Reverse SIP Results">
        <div className="cta-card mb-4">
          <p className="label-overline mb-1 opacity-90 text-white">Required Monthly Commitment</p>
          <p className="result-amount animate-result">{formatINR(results.flatSIP)}<span className="text-xl text-on-surface-var">/mo</span></p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            To reach {formatINRLakh(inflateGoal ? results.goalAdjusted : goal)} corpus in {years} years with {rate}% return
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">With {stepUp}% Step-Up</p>
              <p className="result-amount-sm mango-text">{formatINR(results.stepUpSIP)}<span className="text-sm text-on-surface-var">/mo</span></p>
              <p className="text-xs sage-text mt-1">Start lower, grow with income</p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Total to be Invested</p>
              <p className="result-amount-sm">{formatINRLakh(results.totalFlatInvested)}</p>
            </div>
            {inflateGoal && (
              <div className="inner-card">
                <p className="label-overline lavender-text mb-1">Inflation-Adj Goal ({inflation}%)</p>
                <p className="result-amount-sm lavender-text">{formatINRLakh(results.goalAdjusted)}</p>
              </div>
            )}
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Wealth Multiple</p>
              <p className="result-amount-sm mango-text">
                {results.flatFV > 0 && results.totalFlatInvested > 0
                  ? `${(results.flatFV / results.totalFlatInvested).toFixed(2)}×`
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Cost of Waiting — reverse variant */}
        {results.sipIncrease > 0 && (
          <div className="cost-of-waiting mt-8 flex gap-4">
            <div className="text-warning text-2xl">⚠️</div>
            <div>
              <p className="label-overline mb-1 text-primary-container">Cost of Waiting</p>
              <p className="text-sm text-on-surface leading-relaxed">
                Delaying your start by just <strong>1 month</strong> increases your monthly requirement by{' '}
                <span className="font-serif text-lg mango-text">+{formatINR(results.sipIncrease)}</span> to reach the same goal.
              </p>
            </div>
          </div>
        )}

        {/* Peer comparison */}
        <FinancialTwin sipAmount={results.flatSIP} context="required SIP" />

        {/* Disclaimer */}
        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          HonestSIP calculators are for educational purposes only. Not financial advice.
          Tax calculations per Budget 2024. Actual returns may vary.
        </p>
      </section>
    </div>
  );
}
