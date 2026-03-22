import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import SliderField from '../components/SliderField';
import { formatINR, formatINRLakh } from '../lib/ruleEngine';

// Term insurance cover using income replacement + liability method
function calcRequiredCover(annualIncome, liabilities, years, dependents) {
  const incomeReplacement = annualIncome * years * 0.70; // 70% replacement
  const totalLiab = liabilities;
  const dependentBuffer = dependents * 1000000; // 10L per dependent
  return incomeReplacement + totalLiab + dependentBuffer;
}

// Rough premium estimate (indicative only)
function estimatePremium(cover, age, termYears, isSmoker) {
  const baseRate = 0.0006; // ~0.06% of sum assured per year base
  const ageFactor = age < 30 ? 0.7 : age < 40 ? 1.0 : age < 50 ? 1.8 : 3.0;
  const smokeFactor = isSmoker ? 2.0 : 1.0;
  const termFactor = termYears <= 20 ? 1.0 : 1.2;
  return Math.round(cover * baseRate * ageFactor * smokeFactor * termFactor / 12); // monthly
}

export default function TermInsurance() {
  const [annualIncome, setIncome]     = useState(1200000);
  const [liabilities, setLiab]        = useState(5000000);
  const [age, setAge]                 = useState(30);
  const [termYears, setTerm]          = useState(30);
  const [dependents, setDeps]         = useState(2);
  const [existingCover, setExisting]  = useState(0);
  const [isSmoker, setSmoker]         = useState(false);

  const results = useMemo(() => {
    const incomeMultiple  = Math.max(0, 60 - age); // years to 60
    const requiredCover   = calcRequiredCover(annualIncome, liabilities, incomeMultiple, dependents);
    const gap             = Math.max(0, requiredCover - existingCover);
    const monthlyPremium  = estimatePremium(requiredCover, age, termYears, isSmoker);
    const premiumPct      = annualIncome > 0 ? (monthlyPremium * 12 / annualIncome) * 100 : 0;
    const coverMultiple   = annualIncome > 0 ? requiredCover / annualIncome : 0;

    return {
      requiredCover: Math.round(requiredCover),
      gap:           Math.round(gap),
      monthlyPremium,
      premiumPct:    Math.round(premiumPct * 10) / 10,
      coverMultiple: Math.round(coverMultiple * 10) / 10,
      adequate:      existingCover >= requiredCover,
    };
  }, [annualIncome, liabilities, age, termYears, dependents, existingCover, isSmoker]);

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Term Insurance Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Insurance Planning</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Term Insurance<br />
            <em className="italic">Cover Calculator</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Income replacement + liability method. See exactly how much cover you actually need.
          </p>
        </div>

        <div className="section-card mb-4">
          <NumberInput label="Annual Take-Home Income" value={annualIncome} onChange={setIncome} />
          <NumberInput label="Total Outstanding Liabilities" value={liabilities} onChange={setLiab}
            hint="Home loan + car loan + personal loan + other EMIs" />
          <NumberInput label="Existing Life Insurance Cover" value={existingCover} onChange={setExisting}
            hint="Sum assured from all active policies" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="label-overline mb-2">Current Age</p>
              <div className="flex items-baseline gap-2 border-b border-outline-var/20 focus-within:border-primary pb-1 transition-colors">
                <input
                  type="number"
                  value={age}
                  min={18}
                  max={65}
                  onChange={e => setAge(Number(e.target.value))}
                  onFocus={e => e.target.select()}
                  className="flex-1 bg-transparent text-on-surface font-serif text-2xl focus:outline-none appearance-none"
                  style={{ fontFamily: 'Newsreader, Georgia, serif' }}
                />
                <span className="font-sans text-on-surface-var text-sm">yrs</span>
              </div>
            </div>
            <div>
              <p className="label-overline mb-1">Dependents</p>
              <input type="number" value={dependents} min={0} max={10}
                onChange={e => setDeps(Number(e.target.value))} className="input-ghost text-center" />
            </div>
          </div>

          <SliderField
            label="Policy Term"
            value={termYears}
            min={10}
            max={40}
            unit=" yrs"
            onChange={setTerm}
          />

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-overline">Smoker?</p>
              <p className="text-xs text-on-surface-var opacity-60">Significantly affects premium</p>
            </div>
            <button className={`toggle-track ${isSmoker ? 'active' : ''}`} onClick={() => setSmoker(!isSmoker)}>
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </section>

      <section aria-label="Term Insurance Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-1">Recommended Cover</p>
          <p className="result-amount animate-result">{formatINRLakh(results.requiredCover)}</p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            {results.coverMultiple}× your annual income (Income replacement + liability method)
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className={`label-overline mb-1 ${results.adequate ? 'sage-text' : 'text-danger'}`}>
                {results.adequate ? 'Adequately Covered ✅' : 'Cover Gap ⚠️'}
              </p>
              <p className={`result-amount-sm ${results.adequate ? 'sage-text' : 'text-danger'}`}>
                {results.gap > 0 ? formatINRLakh(results.gap) + ' gap' : 'None'}
              </p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Est. Monthly Premium</p>
              <p className="result-amount-sm mango-text">{formatINR(results.monthlyPremium)}</p>
              <p className="text-xs text-on-surface-var opacity-50 mt-1">
                ~{results.premiumPct}% of your income
              </p>
            </div>
          </div>
        </div>

        {results.gap > 0 && (
          <div className="cost-of-waiting mt-4">
            <p className="label-overline mb-1 text-primary-container">⚠️ Protection Gap</p>
            <p className="text-sm text-on-surface">
              You're under-insured by{' '}
              <span className="mango-text font-serif text-xl">{formatINRLakh(results.gap)}</span>.
              Your family would need this to maintain their lifestyle on your existing cover.
            </p>
          </div>
        )}

        <div className="glass-card p-4 mt-4">
          <p className="label-overline lavender-text mb-2">📌 India Insurance Gap</p>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Only <span className="mango-text">~35% of earning Indians</span> have adequate term coverage
            (IRDAI Annual Report 2023-24). Life insurance penetration: 3.2% of GDP.
            Premium estimate is indicative — actual premiums vary by insurer, health, and lifestyle.
          </p>
        </div>

      </section>
    </div>
  );
}
