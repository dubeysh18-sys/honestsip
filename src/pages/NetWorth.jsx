import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import { netWorthBenchmark, formatINR, formatINRLakh } from '../lib/ruleEngine';

export default function NetWorth() {
  // Assets
  const [liquidCash, setLiquidCash]       = useState(100000);
  const [mfStocks, setMfStocks]           = useState(500000);
  const [ppfEpf, setPpfEpf]               = useState(200000);
  const [realEstate, setRealEstate]       = useState(0);
  const [gold, setGold]                   = useState(0);
  const [otherAssets, setOtherAssets]     = useState(0);
  // Liabilities
  const [homeLoan, setHomeLoan]           = useState(0);
  const [carLoan, setCarLoan]             = useState(0);
  const [personalLoan, setPersonalLoan]   = useState(0);
  const [creditCard, setCreditCard]       = useState(0);
  const [otherLiab, setOtherLiab]         = useState(0);
  // Profile
  const [age, setAge]                     = useState(30);
  const [annualIncome, setAnnualIncome]   = useState(1200000);

  const results = useMemo(() => {
    const liquidAssets  = liquidCash + mfStocks + ppfEpf + gold;
    const illiquidAssets = realEstate + otherAssets;
    const totalAssets   = liquidAssets + illiquidAssets;
    const totalLiab     = homeLoan + carLoan + personalLoan + creditCard + otherLiab;
    const netWorth      = totalAssets - totalLiab;
    const bm            = netWorthBenchmark(age);
    const multiple      = annualIncome > 0 ? netWorth / annualIncome : 0;
    const liquidRatio   = totalAssets > 0 ? liquidAssets / totalAssets : 0;

    let status, statusLabel;
    if (multiple < bm.medianLow)       { status = 'red';    statusLabel = 'Behind'; }
    else if (multiple < bm.medianHigh) { status = 'yellow'; statusLabel = 'On Track'; }
    else if (multiple < bm.goodLow)    { status = 'green';  statusLabel = 'Good'; }
    else                               { status = 'green';  statusLabel = 'Excellent'; }

    return {
      totalAssets, totalLiab, netWorth, liquidAssets, illiquidAssets,
      multiple: Math.round(multiple * 10) / 10,
      liquidRatio: Math.round(liquidRatio * 100),
      status, statusLabel,
      bm,
    };
  }, [liquidCash, mfStocks, ppfEpf, realEstate, gold, otherAssets,
      homeLoan, carLoan, personalLoan, creditCard, otherLiab, age, annualIncome]);

  const statusClasses = { red: 'badge-red', yellow: 'badge-yellow', green: 'badge-green' };

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Net Worth Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Wealth Snapshot</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Net Worth<br />
            <em className="italic">Snapshot</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Assets minus liabilities, benchmarked to your age and income cohort.
          </p>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Profile</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="label-overline mb-1">Age</p>
              <input type="number" min={18} max={80} value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="input-ghost" />
            </div>
            <div>
              <p className="label-overline mb-1">Annual Income (₹)</p>
              <input type="number" min={0} value={annualIncome}
                onChange={e => setAnnualIncome(Number(e.target.value))}
                className="input-ghost" style={{ fontFamily: 'Newsreader', fontSize: '1.25rem' }} />
            </div>
          </div>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline sage-text mb-4">Assets</p>
          <NumberInput label="Cash & Savings Account"          value={liquidCash}    onChange={setLiquidCash} />
          <NumberInput label="Mutual Funds & Stocks"           value={mfStocks}      onChange={setMfStocks} />
          <NumberInput label="PPF / EPF / NPS"                 value={ppfEpf}        onChange={setPpfEpf} />
          <NumberInput label="Gold & Jewellery"                value={gold}          onChange={setGold} />
          <NumberInput label="Real Estate (market value)"      value={realEstate}    onChange={setRealEstate} />
          <NumberInput label="Other Assets"                    value={otherAssets}   onChange={setOtherAssets} />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-danger mb-4">Liabilities</p>
          <NumberInput label="Home Loan Outstanding"           value={homeLoan}      onChange={setHomeLoan} />
          <NumberInput label="Car Loan Outstanding"            value={carLoan}       onChange={setCarLoan} />
          <NumberInput label="Personal Loan Outstanding"       value={personalLoan}  onChange={setPersonalLoan} />
          <NumberInput label="Credit Card Dues"                value={creditCard}    onChange={setCreditCard} />
          <NumberInput label="Other Liabilities"               value={otherLiab}     onChange={setOtherLiab} />
        </div>
      </section>

      <section aria-label="Net Worth Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-1">Your Net Worth</p>
          <p className={`result-amount animate-result ${results.netWorth < 0 ? 'text-danger' : ''}`}>
            {formatINRLakh(results.netWorth)}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline sage-text mb-1">Total Assets</p>
              <p className="result-amount-sm sage-text">{formatINRLakh(results.totalAssets)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-danger mb-1">Total Liabilities</p>
              <p className="result-amount-sm text-danger">{formatINRLakh(results.totalLiab)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Liquid Assets</p>
              <p className="result-amount-sm">{results.liquidRatio}%</p>
              <p className="text-xs text-on-surface-var opacity-50 mt-0.5">of total assets</p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Net Worth Multiple</p>
              <p className={`result-amount-sm ${results.status === 'green' ? 'sage-text' : results.status === 'yellow' ? 'text-warning' : 'text-danger'}`}>
                {results.multiple}×
              </p>
              <p className="text-xs text-on-surface-var opacity-50 mt-0.5">of annual income</p>
            </div>
          </div>
        </div>

        <div className="section-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="label-overline text-on-surface-var">Age {age} Benchmark</p>
            <span className={statusClasses[results.status]}>{results.statusLabel}</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Median Range', low: results.bm.medianLow, high: results.bm.medianHigh, color: 'text-on-surface-var' },
              { label: 'Good Range',   low: results.bm.goodLow,   high: results.bm.goodHigh,   color: 'sage-text' },
            ].map(r => (
              <div key={r.label} className="inner-card flex justify-between items-center">
                <p className="text-xs text-on-surface-var">{r.label}</p>
                <p className={`text-sm font-semibold ${r.color}`}>
                  {r.low.toFixed(1)}× – {r.high.toFixed(1)}×
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-var opacity-50 mt-3">
            Based on WID India 2024 + Fidelity milestones adapted for Indian income levels.
          </p>
        </div>

      </section>
    </div>
  );
}
