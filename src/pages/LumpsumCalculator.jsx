import React, { useState, useMemo } from 'react';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import GrowthChart from '../components/GrowthChart';
import FinancialTwin from '../components/FinancialTwin';
import {
  lumpSumFV, monthlyRate, formatINR, formatINRLakh,
} from '../lib/ruleEngine';

const ASSET_CLASSES = [
  { value: 'equity',      label: 'Equity Mutual Funds', rate: 13 },
  { value: 'gold',        label: 'Gold / SGB / ETFs',   rate: 9  },
  { value: 'real-estate', label: 'Real Estate / REITs', rate: 10 },
  { value: 'fd',          label: 'Fixed Deposit / Debt', rate: 7  },
  { value: 'bitcoin',     label: 'Bitcoin / Crypto',    rate: 30 },
];

function yearByYearLumpsum(amount, annualRate, years) {
  const i = monthlyRate(annualRate);
  return Array.from({ length: years }, (_, idx) => {
    const yr = idx + 1;
    const n = yr * 12;
    const corpus = lumpSumFV(amount, i, n);
    return {
      year: yr,
      corpus: Math.round(corpus),
      invested: Math.round(amount),
      gains: Math.round(corpus - amount),
    };
  });
}

export default function LumpsumCalculator() {
  const [amount, setAmount]       = useState(100000);
  const [years, setYears]         = useState(10);
  const [rate, setRate]           = useState(13);
  const [assetClass, setAssetClass] = useState('equity');
  const [inflation, setInflation] = useState(6);
  const [showInflation, setShowInflation] = useState(true);

  // When asset class changes, update the rate suggestion
  const handleAssetChange = (val) => {
    setAssetClass(val);
    const ac = ASSET_CLASSES.find(a => a.value === val);
    if (ac) setRate(ac.rate);
  };

  const results = useMemo(() => {
    const r = rate / 100;
    const inf = inflation / 100;
    const i = monthlyRate(r);
    const n = years * 12;

    const fvGross = lumpSumFV(amount, i, n);
    const gains   = Math.max(0, fvGross - amount);
    const fvReal  = fvGross / Math.pow(1 + inf, years);
    const multiplier = amount > 0 ? fvGross / amount : 1;
    const cagr    = amount > 0 ? (Math.pow(fvGross / amount, 1 / years) - 1) * 100 : 0;
    const chartData = yearByYearLumpsum(amount, r, years);

    return {
      fvGross: Math.round(fvGross),
      fvReal:  Math.round(fvReal),
      gains:   Math.round(gains),
      multiplier: Math.round(multiplier * 10) / 10,
      cagr:    Math.round(cagr * 10) / 10,
      chartData,
    };
  }, [amount, years, rate, inflation]);

  const selectedAsset = ASSET_CLASSES.find(a => a.value === assetClass) || ASSET_CLASSES[0];

  return (
    <div className="page-section pb-28 md:pb-12">
      {/* Header */}
      <div className="mb-6">
        <p className="label-overline text-on-surface-var mb-2">One-Time Investment</p>
        <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-3 leading-tight">
          Lumpsum<br />
          <em className="italic">Growth Calculator</em>
        </h1>
        <p className="text-sm text-on-surface-var leading-relaxed">
          How much will a one-time investment grow? See the compounding power of a single deployment.
        </p>
      </div>

      {/* Inputs */}
      <section aria-label="Lumpsum Calculator Inputs">
        <div className="section-card mb-4">
          <NumberInput
            label="Lumpsum Investment Amount"
            value={amount}
            onChange={setAmount}
            hint="One-time amount deployed today"
          />

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
            max={40}
            unit="%"
            onChange={setRate}
          />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Configuration</p>

          {/* Asset class picker */}
          <div className="space-y-2 mb-5">
            {ASSET_CLASSES.map(ac => (
              <button
                key={ac.value}
                onClick={() => handleAssetChange(ac.value)}
                className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center border ${
                  assetClass === ac.value
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-surface-high border-transparent'
                }`}
              >
                <p className="text-sm text-on-surface font-medium">{ac.label}</p>
                <p className="text-xs mango-text font-semibold flex-shrink-0 ml-3">~{ac.rate}% p.a.</p>
              </button>
            ))}
          </div>

          {/* Inflation toggle + slider */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-overline">Inflation Adjustment</p>
              <p className="text-xs text-on-surface-var opacity-60 mt-0.5">
                Show real (purchasing power) value
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
        </div>
      </section>

      {/* Results */}
      <section aria-label="Lumpsum Calculator Results">
        <div className="cta-card mb-4">
          <p className="label-overline mb-2 opacity-90 text-white">Maturity Value</p>
          <p className="result-amount animate-result">{formatINR(results.fvGross, true)}</p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            Nominal value after {years} year{years !== 1 ? 's' : ''} at {rate}% annual return
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Amount Invested</p>
              <p className="result-amount-sm">{formatINRLakh(amount)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline sage-text mb-1">Total Gains</p>
              <p className="result-amount-sm sage-text">{formatINRLakh(results.gains)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline mango-text mb-1">Wealth Multiplier</p>
              <p className="result-amount-sm mango-text">{results.multiplier}×</p>
            </div>
            {showInflation && (
              <div className="inner-card">
                <p className="label-overline lavender-text mb-1">Real Value ({inflation}% inf)</p>
                <p className="result-amount-sm lavender-text">{formatINRLakh(results.fvReal)}</p>
              </div>
            )}
          </div>
        </div>

        {/* CAGR callout */}
        <div className="glass-card p-4 mb-4">
          <p className="label-overline lavender-text mb-2">📈 Effective CAGR</p>
          <p className="text-sm text-on-surface leading-relaxed">
            Your investment grows at <span className="mango-text font-semibold font-serif text-lg">{results.cagr}%</span> compounded annually in{' '}
            <span className="mango-text">{selectedAsset.label}</span> — turning every{' '}
            <span className="mango-text">{formatINR(amount, true)}</span> into{' '}
            <span className="mango-text font-semibold font-serif">{formatINR(results.fvGross, true)}</span>{' '}
            over {years} years.
          </p>
        </div>

        {/* Growth chart */}
        <div className="section-card mt-4">
          <GrowthChart data={results.chartData} />
        </div>

        <FinancialTwin sipAmount={amount} context="lumpsum investment" />

      </section>
    </div>
  );
}
