import React, { useState, useMemo } from 'react';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import CostOfWaiting from '../components/CostOfWaiting';
import FinancialTwin from '../components/FinancialTwin';
import {
  monthlyRate, reverseSIP, reverseStepUpSIP, inflationAdjustedGoal,
  costOfWaiting, formatINR, formatINRLakh,
} from '../lib/ruleEngine';
import { GOAL_DEFAULTS } from '../lib/benchmarkData';

export default function GoalPlanner() {
  const [goalType, setGoalType] = useState('child-education');
  const [years, setYears]       = useState(10);
  const [rate, setRate]         = useState(12);
  const [stepUp, setStepUp]     = useState(10);
  const [lumpSum, setLumpSum]   = useState(0);
  const [customCost, setCustomCost] = useState(null);

  const goalInfo = GOAL_DEFAULTS[goalType];
  const currentCost = customCost !== null ? customCost : (goalInfo.defaultCost || 2000000);
  const inf = goalInfo.inflation;

  const results = useMemo(() => {
    const r = rate / 100;
    const g = stepUp / 100;
    const i = monthlyRate(r);
    const n = years * 12;

    const futureGoal = inflationAdjustedGoal(currentCost, inf, years);
    const lumpSipFV  = lumpSum > 0 ? lumpSum * Math.pow(1 + i, n) : 0;
    const netGoal    = Math.max(0, futureGoal - lumpSipFV);

    const flatSIP    = netGoal > 0 ? Math.ceil(reverseSIP(netGoal, i, n)) : 0;
    const stepUpSIP  = netGoal > 0 ? reverseStepUpSIP(netGoal, g, r, years) : 0;
    const cow        = flatSIP > 0 ? costOfWaiting(flatSIP, r, n) : 0;
    const sipIncrease = flatSIP > 0 && n > 1
      ? Math.max(0, Math.ceil(reverseSIP(netGoal, i, n - 1) - flatSIP))
      : 0;

    return {
      futureGoal:  Math.round(futureGoal),
      flatSIP,
      stepUpSIP,
      sipIncrease,
      cow,
    };
  }, [goalType, years, rate, stepUp, lumpSum, currentCost, inf]);

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Goal Planner Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Goal Engineering</p>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-3 leading-tight">
            New Family<br />
            <em className="italic">Runway</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Pick a life goal. We calculate the monthly SIP with honest inflation defaults.
          </p>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline mb-2">Select Your Goal</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {Object.entries(GOAL_DEFAULTS).map(([key, g]) => (
              <button
                key={key}
                onClick={() => { setGoalType(key); setCustomCost(null); }}
                className="text-left p-3 rounded-xl text-sm transition-all"
                style={{
                  background: goalType === key ? 'rgba(255,183,125,0.12)' : '#2a2a2a',
                  border: goalType === key ? '1px solid rgba(255,183,125,0.3)' : '1px solid transparent',
                }}
              >
                <span className="text-lg">{g.emoji}</span>
                <p className="text-xs text-on-surface mt-1 font-medium leading-snug">{g.label}</p>
                {g.defaultCost && (
                  <p className="text-xs text-on-surface-var opacity-50 mt-0.5">
                    {(g.defaultCost / 100000).toFixed(0)}L default
                  </p>
                )}
              </button>
            ))}
          </div>

          {goalInfo.note && (
            <div className="inner-card mb-4">
              <p className="text-xs sage-text">📌 {goalInfo.note}</p>
            </div>
          )}

          <NumberInput
            label={`Current Cost of Goal (${goalInfo.emoji})`}
            value={currentCost}
            onChange={(v) => setCustomCost(v)}
            hint={`Default: ${formatINR(goalInfo.defaultCost || 0)}. Adjust if your estimate differs.`}
          />

          <SliderField
            label="Years to Goal"
            value={years}
            min={1}
            max={30}
            unit=" yrs"
            onChange={setYears}
          />

          <SliderField
            label="Expected Return"
            value={rate}
            min={1}
            max={30}
            unit="%"
            onChange={setRate}
          />

          <SliderField
            label="Annual Step-Up"
            value={stepUp}
            min={0}
            max={30}
            unit="%"
            onChange={setStepUp}
          />

          <NumberInput
            label="Existing Savings for This Goal (Optional)"
            value={lumpSum}
            onChange={setLumpSum}
          />
        </div>
      </section>

      <section aria-label="Goal Planner Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-1">Required Monthly SIP</p>
          <p className="result-amount animate-result">{formatINR(results.flatSIP)}<span className="text-xl text-on-surface-var">/mo</span></p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            Goal inflated to {formatINRLakh(results.futureGoal)} at {(inf * 100).toFixed(0)}% p.a. in {years} yrs
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">With {stepUp}% Step-Up</p>
              <p className="result-amount-sm mango-text">{formatINR(results.stepUpSIP)}<span className="text-sm text-on-surface-var">/mo</span></p>
            </div>
            <div className="inner-card">
              <p className="label-overline lavender-text mb-1">Future Goal Value</p>
              <p className="result-amount-sm lavender-text">{formatINRLakh(results.futureGoal)}</p>
            </div>
          </div>
        </div>

        {results.sipIncrease > 0 && (
          <div className="cost-of-waiting mt-4">
            <p className="label-overline mb-1 text-primary-container">⚡ Cost of Waiting</p>
            <p className="text-sm text-on-surface leading-relaxed">
              Starting 1 month later means your SIP must increase by{' '}
              <span className="font-serif text-xl mango-text">{formatINR(results.sipIncrease)}</span>/month.
            </p>
          </div>
        )}

        <FinancialTwin sipAmount={results.flatSIP} context="goal SIP" />

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          Goal inflation rates based on EY-CII 2023, RBI FSR, and IRDAI data. Educational purposes only.
        </p>
      </section>
    </div>
  );
}
