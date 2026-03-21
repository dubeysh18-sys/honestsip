import React, { useState, useMemo, useEffect } from 'react';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import Select from '../components/Select';
import CostOfWaiting from '../components/CostOfWaiting';
import GrowthChart from '../components/GrowthChart';
import RealWorldTranslation from '../components/RealWorldTranslation';
import FinancialTwin from '../components/FinancialTwin';
import {
  monthlyRate, sipFV, stepUpSIPFV, lumpSumFV,
  costOfWaiting, yearByYearGrowth, taxEngine,
  totalInvestedFlat, totalInvestedStepUp,
  inflationAdjustedGoal, formatINR, formatINRLakh, selfTest,
} from '../lib/ruleEngine';

const TAX_TYPES = [
  { value: 'equity-ltcg', label: 'LTCG – Equity (12.5%)', assetClass: 'equity', holding: 5 },
  { value: 'equity-stcg', label: 'STCG – Equity (20%)',  assetClass: 'equity', holding: 0.5 },
  { value: 'debt',        label: 'Debt Fund (Slab Rate)', assetClass: 'debt',   holding: 5 },
  { value: 'gold',        label: 'Gold ETF / Intl Fund',  assetClass: 'gold',   holding: 5 },
];

const SLAB_RATES = [
  { label: '0% (No tax)', value: 0    },
  { label: '5%',          value: 0.05 },
  { label: '10%',         value: 0.10 },
  { label: '15%',         value: 0.15 },
  { label: '20%',         value: 0.20 },
  { label: '30%',         value: 0.30 },
];

export default function ForwardSIP() {
  // --- Inputs ---
  const [sip, setSip]           = useState(5000);
  const [years, setYears]       = useState(10);
  const [rate, setRate]         = useState(12);
  const [stepUp, setStepUp]     = useState(0);
  const [lumpSum, setLumpSum]   = useState(0);
  const [freq, setFreq]         = useState('monthly'); // monthly | quarterly
  const [inflation, setInflation] = useState(6);
  const [showInflation, setShowInflation] = useState(true);
  const [taxType, setTaxType]   = useState('equity-ltcg');
  const [slabRate, setSlabRate] = useState(0.20);

  // Computed results
  const results = useMemo(() => {
    const r = rate / 100;
    const inf = inflation / 100;
    const g = stepUp / 100;
    const n = freq === 'quarterly' ? years * 4 : years * 12;
    const i = freq === 'quarterly'
      ? Math.pow(1 + r, 1 / 4) - 1
      : monthlyRate(r);

    // Corpus from SIP
    let fvSIP;
    if (g > 0) {
      fvSIP = stepUpSIPFV(sip, g, r, years);
    } else {
      fvSIP = sipFV(sip, i, n);
    }

    // Lump sum contribution
    const fvLump = lumpSum > 0 ? lumpSumFV(lumpSum, i, n) : 0;
    const fvGross = fvSIP + fvLump;

    // Total invested
    const totalInvested = g > 0
      ? totalInvestedStepUp(sip, g, years) + lumpSum
      : totalInvestedFlat(sip, n) + lumpSum;

    const gains = Math.max(0, fvGross - totalInvested);

    // Tax
    const selectedTax = TAX_TYPES.find(t => t.value === taxType) || TAX_TYPES[0];
    const { tax, fvNet } = taxEngine(fvGross, totalInvested, selectedTax.assetClass, selectedTax.holding, slabRate);

    // Inflation adjusted
    const fvReal = fvGross / Math.pow(1 + inf, years);

    // Cost of waiting (in months)
    const nMonths = years * 12;
    const cow = costOfWaiting(sip, r, nMonths, g);

    // Chart data
    const chartData = yearByYearGrowth(sip, r, years, g, lumpSum);

    return {
      fvGross: Math.round(fvGross),
      fvReal:  Math.round(fvReal),
      fvNet:   Math.round(fvNet),
      totalInvested: Math.round(totalInvested),
      gains:   Math.round(gains),
      tax:     Math.round(tax),
      cow:     Math.round(cow),
      chartData,
    };
  }, [sip, years, rate, stepUp, lumpSum, freq, inflation, taxType, slabRate]);

  // --- Run self-test in dev mode once ---
  useEffect(() => {
    if (import.meta.env.DEV) selfTest();
  }, []);

  const selectedTax = TAX_TYPES.find(t => t.value === taxType) || TAX_TYPES[0];

  return (
    <div className="page-section pb-28 md:pb-12">
      {/* Left column — Inputs */}
      <section aria-label="SIP Calculator Inputs">
        {/* Header */}
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Wealth Engineering</p>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-3 leading-tight">
            The Forward<br />
            <em className="italic">Wealth Builder</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            What will your SIP grow to? The foundation of every financial plan.
          </p>
        </div>

        {/* Primary SIP input */}
        <div className="section-card mb-4">
          <NumberInput
            label="Monthly SIP Amount"
            value={sip}
            onChange={setSip}
            hint="Starting investment amount. Step-up will increase this annually."
          />

          {/* Frequency toggle */}
          <div className="flex gap-2 mb-5">
            <button
              className={`freq-btn ${freq === 'monthly' ? 'active' : 'inactive'}`}
              onClick={() => setFreq('monthly')}
            >
              Monthly
            </button>
            <button
              className={`freq-btn ${freq === 'quarterly' ? 'active' : 'inactive'}`}
              onClick={() => setFreq('quarterly')}
            >
              Quarterly
            </button>
          </div>

          <SliderField
            label="Investment Duration"
            value={years}
            min={1}
            max={40}
            unit=" yrs"
            onChange={setYears}
          />

          <SliderField
            label="Expected Annual Return"
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
        </div>

        {/* Advanced config */}
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">HonestSIP Configuration</p>

          <NumberInput
            label="Starting Lump Sum (Optional)"
            value={lumpSum}
            onChange={setLumpSum}
            hint="One-time investment deployed on day 1"
          />

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-overline">Inflation Rate</p>
              <p className="text-xs text-on-surface-var opacity-60 mt-0.5">
                Show inflation-adjusted real value
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="mango-text text-sm">{inflation}%</span>
              <button
                className={`toggle-track ${showInflation ? 'active' : ''}`}
                onClick={() => setShowInflation(!showInflation)}
                aria-label={`Inflation adjustment ${showInflation ? 'on' : 'off'}`}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          {showInflation && (
            <SliderField
              label="Inflation Rate"
              value={inflation}
              min={1}
              max={15}
              unit="%"
              onChange={setInflation}
            />
          )}

          <Select
            label="Taxation Type"
            value={taxType}
            onChange={setTaxType}
            options={TAX_TYPES.map(t => ({ value: t.value, label: t.label }))}
          />

          {(taxType === 'debt' || taxType === 'gold') && (
            <Select
              label="Your Tax Slab"
              value={slabRate}
              onChange={(v) => setSlabRate(Number(v))}
              options={SLAB_RATES.map(s => ({ value: s.value, label: s.label }))}
            />
          )}
        </div>
      </section>

      {/* Right column — Results */}
      <section aria-label="SIP Calculator Results">
        {/* Primary result */}
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-2">Maturity Value</p>
          <p className="result-amount animate-result">{formatINR(results.fvGross)}</p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            Nominal value after {years} years at {rate}% annual return
          </p>

          {/* Summary row */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Total Invested</p>
              <p className="result-amount-sm">{formatINRLakh(results.totalInvested)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline sage-text mb-1">Total Gains</p>
              <p className="result-amount-sm sage-text">{formatINRLakh(results.gains)}</p>
            </div>
            {showInflation && (
              <div className="inner-card">
                <p className="label-overline lavender-text mb-1">Real Value ({inflation}% inf)</p>
                <p className="result-amount-sm lavender-text">{formatINRLakh(results.fvReal)}</p>
              </div>
            )}
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Post-Tax ({selectedTax.label.split('(')[0]})</p>
              <p className="result-amount-sm">{formatINRLakh(results.fvNet)}</p>
            </div>
          </div>

          {results.tax > 0 && (
            <p className="text-xs text-on-surface-var opacity-50 mt-3">
              Tax deducted: {formatINR(results.tax)} (Budget 2024 rates)
            </p>
          )}
        </div>

        {/* Cost of Waiting — always visible */}
        <CostOfWaiting delta={results.cow} />

        {/* Growth chart */}
        <div className="section-card mt-4">
          <GrowthChart data={results.chartData} />
        </div>

        {/* Real world translation */}
        <div className="section-card mt-4">
          <RealWorldTranslation
            corpus={results.fvNet}
            yearsFromNow={years}
            monthlyExpense={50000}
            inflationRate={inflation / 100}
          />
        </div>

        {/* Financial Twin (Progressive Profiling) */}
        <FinancialTwin sipAmount={sip} context="monthly SIP" />

        {/* Disclaimer */}
        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          HonestSIP calculators are for educational purposes only.
          Mutual fund investments are subject to market risks.
          Past returns are not indicative of future performance.
        </p>
      </section>
    </div>
  );
}
