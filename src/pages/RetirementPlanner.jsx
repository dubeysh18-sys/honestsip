import React, { useState, useMemo } from 'react';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import FinancialTwin from '../components/FinancialTwin';
import { retirementCalculator, formatINR, formatINRLakh } from '../lib/ruleEngine';

export default function RetirementPlanner() {
  const [currentAge, setCurrentAge]     = useState(28);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLife]       = useState(85);
  const [monthlyIncome, setMonthly]     = useState(100000);
  const [preInf, setPreInf]             = useState(6);
  const [postInf, setPostInf]           = useState(5);
  const [accReturn, setAccReturn]        = useState(12);
  const [withdrawReturn, setWithdraw]   = useState(7);
  const [existingSavings, setExisting]  = useState(0);
  const [epfMonthly, setEpf]            = useState(0);
  const [stepUp, setStepUp]             = useState(10);

  const results = useMemo(() => {
    try {
      return retirementCalculator({
        currentAge,
        retirementAge,
        lifeExpectancy,
        monthlyIncomeNeeded: monthlyIncome,
        preRetirementInflation: preInf / 100,
        postRetirementInflation: postInf / 100,
        accumulationReturn: accReturn / 100,
        withdrawalReturn: withdrawReturn / 100,
        existingSavings,
        epfMonthly,
        stepUpRate: stepUp / 100,
      });
    } catch {
      return null;
    }
  }, [currentAge, retirementAge, lifeExpectancy, monthlyIncome, preInf, postInf, accReturn, withdrawReturn, existingSavings, epfMonthly, stepUp]);

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Retirement Planner Inputs">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-3 leading-tight">
            Retirement Planner<br />
          </h1>
        </div>

        <div className="section-card mb-4">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="label-overline mb-2">Current Age</p>
              <div className="flex items-baseline gap-2 border-b border-outline-var/20 focus-within:border-primary pb-1 transition-colors">
                <input
                  type="number"
                  value={currentAge}
                  min={18}
                  max={70}
                  onChange={e => setCurrentAge(Number(e.target.value))}
                  className="flex-1 bg-transparent text-on-surface font-serif text-2xl focus:outline-none appearance-none"
                  style={{ fontFamily: 'Newsreader, Georgia, serif' }}
                />
                <span className="font-sans text-on-surface-var text-sm">yrs</span>
              </div>
            </div>
            <div>
              <p className="label-overline mb-2">Retirement Age</p>
              <div className="flex items-baseline gap-2 border-b border-outline-var/20 focus-within:border-primary pb-1 transition-colors">
                <input
                  type="number"
                  value={retirementAge}
                  min={currentAge + 1}
                  max={80}
                  onChange={e => setRetirementAge(Number(e.target.value))}
                  className="flex-1 bg-transparent text-on-surface font-serif text-2xl focus:outline-none appearance-none"
                  style={{ fontFamily: 'Newsreader, Georgia, serif' }}
                />
                <span className="font-sans text-on-surface-var text-sm">yrs</span>
              </div>
            </div>
          </div>

          <SliderField
            label="Life Expectancy"
            value={lifeExpectancy}
            min={retirementAge + 1}
            max={100}
            unit=" yrs"
            onChange={setLife}
          />

          <NumberInput
            label="Monthly Income Needed (Today's Value)"
            value={monthlyIncome}
            onChange={setMonthly}
            hint="What you'd need to live comfortably today (inflation-adjusted at retirement)"
          />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Return & Inflation Assumptions</p>

          <SliderField
            label="Accumulation Phase Return"
            value={accReturn}
            min={1}
            max={20}
            unit="%"
            onChange={setAccReturn}
          />

          <SliderField
            label="Withdrawal Phase Return"
            value={withdrawReturn}
            min={1}
            max={15}
            unit="%"
            onChange={setWithdraw}
          />

          <SliderField
            label="Pre-Retirement Inflation"
            value={preInf}
            min={1}
            max={15}
            unit="%"
            onChange={setPreInf}
          />

          <SliderField
            label="Post-Retirement Inflation"
            value={postInf}
            min={1}
            max={12}
            unit="%"
            onChange={setPostInf}
          />

          <SliderField
            label="Annual Step-Up"
            value={stepUp}
            min={0}
            max={20}
            unit="%"
            onChange={setStepUp}
          />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Existing Resources</p>

          <NumberInput
            label="Existing Retirement Savings"
            value={existingSavings}
            onChange={setExisting}
            hint="PF, PPF, mutual funds already earmarked for retirement"
          />

          <NumberInput
            label="Monthly EPF Contribution"
            value={epfMonthly}
            onChange={setEpf}
            hint="80EE - EPFO at 8.25% return assumption"
          />
        </div>
      </section>

      <section aria-label="Retirement Results">
        {results ? (
          <>
            <div className="section-card mb-4">
              <p className="label-overline text-on-surface-var mb-1">Required Monthly SIP</p>
              <p className="result-amount animate-result">
                {formatINR(results.requiredSIP, true)}
                <span className="text-xl text-on-surface-var">/mo</span>
              </p>
              <p className="text-xs text-on-surface-var mt-1 opacity-60">
                With {stepUp}% step-up over {results.accYears} years of accumulation
              </p>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="inner-card">
                  <p className="label-overline lavender-text mb-1">Corpus Needed at {retirementAge}</p>
                  <p className="result-amount-sm lavender-text">{formatINRLakh(results.corpusNeeded)}</p>
                </div>
                <div className="inner-card">
                  <p className="label-overline sage-text mb-1">Monthly Income at Retirement</p>
                  <p className="result-amount-sm sage-text">{formatINRLakh(results.inflatedMonthlyIncome)}</p>
                  <p className="text-xs text-on-surface-var opacity-50 mt-1">Inflation-adjusted</p>
                </div>
                <div className="inner-card">
                  <p className="label-overline text-on-surface-var mb-1">EPF at Retirement</p>
                  <p className="result-amount-sm">{formatINRLakh(results.epfCorpus)}</p>
                </div>
                <div className="inner-card">
                  <p className="label-overline text-on-surface-var mb-1">Withdrawal Years</p>
                  <p className="result-amount-sm mango-text">{results.withdrawalYears} yrs</p>
                </div>
              </div>
            </div>

            <div className="section-card mb-4">
              <p className="label-overline mb-3 text-on-surface-var">Retirement Phases</p>
              <div className="space-y-3">
                <div className="inner-card flex justify-between items-center">
                  <div>
                    <p className="text-xs text-on-surface-var">Accumulation Phase</p>
                    <p className="text-sm text-on-surface">Age {currentAge} → {retirementAge}</p>
                  </div>
                  <p className="mango-text text-sm font-semibold">{results.accYears} years</p>
                </div>
                <div className="inner-card flex justify-between items-center">
                  <div>
                    <p className="text-xs text-on-surface-var">Withdrawal Phase</p>
                    <p className="text-sm text-on-surface">Age {retirementAge} → {lifeExpectancy}</p>
                  </div>
                  <p className="lavender-text text-sm font-semibold">{results.withdrawalYears} years</p>
                </div>
              </div>
            </div>

            <FinancialTwin sipAmount={results.requiredSIP} context="retirement SIP" />
          </>
        ) : (
          <div className="section-card">
            <p className="text-sm text-on-surface-var">Please check your age inputs.</p>
          </div>
        )}

      </section>
    </div>
  );
}
