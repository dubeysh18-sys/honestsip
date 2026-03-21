import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import SliderField from '../components/SliderField';
import { formatINR, formatINRLakh } from '../lib/ruleEngine';

// Budget 2024 New Tax Regime (applicable FY 2024-25)
function newRegimeTax(income) {
  if (income <= 300000)  return 0;
  if (income <= 700000)  return (income - 300000) * 0.05;
  if (income <= 1000000) return 20000 + (income - 700000) * 0.10;
  if (income <= 1200000) return 50000 + (income - 1000000) * 0.15;
  if (income <= 1500000) return 80000 + (income - 1200000) * 0.20;
  return 140000 + (income - 1500000) * 0.30;
}

// Standard rebate under section 87A (new regime: rebate up to ₹25,000 if income ≤ ₹7L)
function applyRebate87A(tax, income, regime) {
  if (regime === 'new' && income <= 700000) return 0;
  if (regime === 'old' && income <= 500000) return 0;
  return tax;
}

// Old regime slabs (no rebate calculation, uses flat slabs)
function oldRegimeTax(taxableIncome) {
  if (taxableIncome <= 250000)  return 0;
  if (taxableIncome <= 500000)  return (taxableIncome - 250000) * 0.05;
  if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.20;
  return 112500 + (taxableIncome - 1000000) * 0.30;
}

function withSurchargeAndCess(tax, income) {
  let surcharge = 0;
  if      (income > 50000000) surcharge = tax * 0.37;
  else if (income > 20000000) surcharge = tax * 0.25;
  else if (income > 10000000) surcharge = tax * 0.15;
  else if (income > 5000000)  surcharge = tax * 0.10;
  return (tax + surcharge) * 1.04; // 4% cess
}

export default function TaxRegime() {
  const [grossSalary, setGross]   = useState(1200000);
  const [hraExempt, setHra]       = useState(120000);
  const [hra80c, set80c]          = useState(150000);
  const [nps80ccd, setNps]        = useState(50000);
  const [medicalIns, setMedical]  = useState(25000);
  const [homeLoanInt, setHomeLoan] = useState(200000);
  const [stdDeduction, setStd]    = useState(75000); // Budget 2024 increased from 50k to 75k

  const results = useMemo(() => {
    // Old Regime
    const totalDeductions = hraExempt + hra80c + nps80ccd + medicalIns + homeLoanInt + stdDeduction;
    const oldTaxableIncome = Math.max(0, grossSalary - totalDeductions);
    const oldTaxBase   = oldRegimeTax(oldTaxableIncome);
    const oldTaxPre87A = applyRebate87A(oldTaxBase, oldTaxableIncome, 'old');
    const oldTaxFinal  = Math.round(withSurchargeAndCess(oldTaxPre87A, grossSalary));

    // New Regime (Budget 2024: standard deduction ₹75,000, only NPS 80CCD(2) allowed)
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossSalary - newStdDeduction);
    const newTaxBase   = newRegimeTax(newTaxableIncome);
    const newTaxPre87A = applyRebate87A(newTaxBase, grossSalary, 'new');
    const newTaxFinal  = Math.round(withSurchargeAndCess(newTaxPre87A, grossSalary));

    // savings = how much MORE you pay in Old regime vs New. Positive → New regime wins.
    const oldMinusNew    = oldTaxFinal - newTaxFinal;
    const savings_abs    = Math.abs(oldMinusNew);
    const oldEffRate     = grossSalary > 0 ? Math.round((oldTaxFinal / grossSalary) * 100 * 10) / 10 : 0;
    const newEffRate     = grossSalary > 0 ? Math.round((newTaxFinal / grossSalary) * 100 * 10) / 10 : 0;
    const oldNetSalary   = grossSalary - oldTaxFinal;
    const newNetSalary   = grossSalary - newTaxFinal;

    return {
      oldTaxFinal, newTaxFinal,
      savings: oldMinusNew, savings_abs,
      // Old regime wins when old tax is LOWER (i.e. oldMinusNew < 0)
      betterRegime: oldMinusNew < 0 ? 'Old' : oldMinusNew > 0 ? 'New' : 'Equal',
      oldEffRate, newEffRate,
      oldTaxableIncome, newTaxableIncome,
      oldNetSalary, newNetSalary,
      totalDeductions,
      deductionsForgone: oldMinusNew > 0 ? totalDeductions : 0, // only show forgone when Old has more deductions
    };

  }, [grossSalary, hraExempt, hra80c, nps80ccd, medicalIns, homeLoanInt, stdDeduction]);

  const betterClasses = { Old: 'badge-yellow', New: 'badge-green', Equal: 'badge-yellow' };
  const betterColor   = { Old: 'mango-text',   New: 'sage-text',   Equal: 'text-on-surface' };

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Tax Regime Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Tax Planning</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Old vs New<br />
            <em className="italic">Tax Regime</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Enter your salary structure. See exactly which regime saves you more — Budget 2024 rates.
          </p>
        </div>

        <div className="section-card mb-4">
          <NumberInput label="Gross Annual Salary (CTC)" value={grossSalary} onChange={setGross} />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Old Regime Deductions</p>
          <NumberInput label="HRA Exemption (u/s 10(13A))" value={hraExempt} onChange={setHra}
            hint="Leave blank if you don't stay in rented accommodation" />
          <NumberInput label="80C (PF + Insurance + ELSS)" value={hra80c} onChange={set80c}
            hint="Max ₹1,50,000" />
          <NumberInput label="80CCD(1B) NPS Contribution" value={nps80ccd} onChange={setNps}
            hint="Additional NPS – max ₹50,000" />
          <NumberInput label="80D Medical Insurance Premium" value={medicalIns} onChange={setMedical}
            hint="Self: ₹25,000 + Parents: ₹50,000 max" />
          <NumberInput label="24(b) Home Loan Interest" value={homeLoanInt} onChange={setHomeLoan}
            hint="Max ₹2,00,000 for self-occupied property" />
          <SliderField
            label="Standard Deduction"
            value={stdDeduction}
            min={50000}
            max={75000}
            step={25000}
            unit=""
            onChange={setStd}
            formatValue={(v) => `₹${v.toLocaleString('en-IN')}`}
          />
        </div>
      </section>

      <section aria-label="Tax Regime Results">
        <div className="section-card mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="label-overline text-on-surface-var">Verdict</p>
            <span className={betterClasses[results.betterRegime]}>
              {results.betterRegime} Regime Wins
            </span>
          </div>

          <p className={`result-amount animate-result ${betterColor[results.betterRegime]}`}>
            {results.betterRegime === 'New' ? 'New Regime' : results.betterRegime === 'Old' ? 'Old Regime' : 'Both Equal'}
          </p>
          {results.savings !== 0 && (
            <p className="text-sm text-on-surface-var mt-2">
              You save <span className="mango-text font-serif text-xl">{formatINR(results.savings_abs)}</span>/year in tax.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline mango-text mb-1">Old Regime Tax</p>
              <p className="result-amount-sm mango-text">{formatINR(results.oldTaxFinal)}</p>
              <p className="text-xs text-on-surface-var opacity-50 mt-1">Eff. rate: {results.oldEffRate}%</p>
              <p className="text-xs text-on-surface-var opacity-50">Net salary: {formatINRLakh(results.oldNetSalary)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline sage-text mb-1">New Regime Tax</p>
              <p className="result-amount-sm sage-text">{formatINR(results.newTaxFinal)}</p>
              <p className="text-xs text-on-surface-var opacity-50 mt-1">Eff. rate: {results.newEffRate}%</p>
              <p className="text-xs text-on-surface-var opacity-50">Net salary: {formatINRLakh(results.newNetSalary)}</p>
            </div>
          </div>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-3">Deduction Impact</p>
          <div className="inner-card mb-3">
            <p className="text-xs text-on-surface-var mb-1">Total Deductions Claimed (Old Regime)</p>
            <p className="font-serif text-xl mango-text">{formatINR(results.totalDeductions)}</p>
          </div>
          {results.deductionsForgone > 0 && (
            <div className="inner-card">
              <p className="text-xs text-on-surface-var mb-1">Deductions you'd give up switching to New Regime</p>
              <p className="font-serif text-xl text-danger">{formatINR(results.deductionsForgone)}</p>
              <p className="text-xs text-on-surface-var opacity-60 mt-1">
                But you still save tax overall. The break-even is worth it.
              </p>
            </div>
          )}
        </div>

        <div className="glass-card p-4 mt-4">
          <p className="label-overline lavender-text mb-2">📌 Budget 2024 Changes</p>
          <p className="text-sm text-on-surface-var leading-relaxed">
            New Regime: Standard deduction raised ₹50K → <span className="mango-text">₹75K</span>.
            Tax slabs revised. Effective for FY 2024-25 onwards.
            STCG on equity: <span className="mango-text">15% → 20%</span>.
            LTCG on equity: <span className="mango-text">10% → 12.5%</span>.
            LTCG exemption: ₹1L → <span className="mango-text">₹1.25L</span>.
          </p>
        </div>

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          Tax calculations per Budget 2024 (Finance Act 2024), effective FY 2024-25.
          Includes 4% Health & Education cess. Surcharge applied where applicable.
          Consult a CA for personalised tax advice.
        </p>
      </section>
    </div>
  );
}
