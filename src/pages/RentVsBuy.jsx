import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import SliderField from '../components/SliderField';
import { monthlyRate, lumpSumFV, formatINR, formatINRLakh } from '../lib/ruleEngine';

export default function RentVsBuy() {
  const [propertyPrice, setProperty]   = useState(8000000);
  const [downPaymentPct, setDownPct]   = useState(20);
  const [homeLoanRate, setHomeLoan]    = useState(8.5);
  const [tenure, setTenure]            = useState(20);
  const [monthlyRent, setRent]         = useState(25000);
  const [rentGrowth, setRentGrowth]    = useState(5);
  const [propertyGrowth, setPropGrowth] = useState(7);
  const [stampDuty, setStampDuty]      = useState(5);
  const [maintPct, setMaint]           = useState(0.5);
  const [investReturn, setInvReturn]   = useState(12);
  const [horizon, setHorizon]          = useState(10);

  const results = useMemo(() => {
    const downPayment       = propertyPrice * (downPaymentPct / 100);
    const loanAmount        = propertyPrice - downPayment;
    const rMonthly          = homeLoanRate / 100 / 12;
    const nEMI              = tenure * 12;
    const emi               = rMonthly > 0
      ? loanAmount * rMonthly * Math.pow(1 + rMonthly, nEMI) / (Math.pow(1 + rMonthly, nEMI) - 1)
      : loanAmount / nEMI;

    const stampDutyAmt      = propertyPrice * (stampDuty / 100);
    const registrationAmt   = propertyPrice * 0.01; // ~1%
    const upfrontCost       = downPayment + stampDutyAmt + registrationAmt;

    const horizonMonths = horizon * 12;

    // --- Buying cost over horizon ---
    let totalEMI = 0, totalMaint = 0, totalInsurance = 0;
    for (let m = 0; m < horizonMonths; m++) {
      totalEMI       += m < nEMI ? emi : 0;
      totalMaint     += (propertyPrice * maintPct / 100) / 12;
      totalInsurance += 3000 / 12; // rough home insurance
    }
    // Property value at horizon
    const propFutureValue = propertyPrice * Math.pow(1 + propertyGrowth / 100, horizon);
    // Outstanding loan at horizon
    const monthsPaid = Math.min(horizonMonths, nEMI);
    const loanOutstanding = rMonthly > 0
      ? loanAmount * (Math.pow(1 + rMonthly, nEMI) - Math.pow(1 + rMonthly, monthsPaid))
        / (Math.pow(1 + rMonthly, nEMI) - 1)
      : Math.max(0, loanAmount - (loanAmount / nEMI) * monthsPaid);

    const netEquity = propFutureValue - loanOutstanding;
    const buyCostTotal = upfrontCost + totalEMI + totalMaint + totalInsurance;
    const buyNetPosition = netEquity - buyCostTotal;

    // --- Renting cost over horizon ---
    let totalRentPaid = 0;
    for (let yr = 0; yr < horizon; yr++) {
      totalRentPaid += monthlyRent * Math.pow(1 + rentGrowth / 100, yr) * 12;
    }
    // Opportunity cost of down payment invested
    const oppCostFV = lumpSumFV(upfrontCost, monthlyRate(investReturn / 100), horizonMonths);
    const rentNetPosition = oppCostFV - totalRentPaid;

    // Break-even year
    let breakEvenYear = null;
    for (let yr = 1; yr <= 30; yr++) {
      const pv = propertyPrice * Math.pow(1 + propertyGrowth / 100, yr);
      const lo = rMonthly > 0
        ? loanAmount * (Math.pow(1 + rMonthly, nEMI) - Math.pow(1 + rMonthly, Math.min(yr * 12, nEMI)))
          / (Math.pow(1 + rMonthly, nEMI) - 1)
        : Math.max(0, loanAmount - loanAmount / tenure * yr);
      const equity = pv - lo - upfrontCost - (propertyPrice * maintPct / 100) * yr;
      const rentCumulative = (() => {
        let t = 0;
        for (let y = 0; y < yr; y++) t += monthlyRent * Math.pow(1 + rentGrowth / 100, y) * 12;
        return t;
      })();
      const rentOpp = lumpSumFV(upfrontCost, monthlyRate(investReturn / 100), yr * 12) - rentCumulative;
      if (equity > rentOpp && breakEvenYear === null) breakEvenYear = yr;
    }

    return {
      emi: Math.round(emi),
      upfrontCost:     Math.round(upfrontCost),
      downPayment:     Math.round(downPayment),
      stampDutyAmt:    Math.round(stampDutyAmt),
      totalEMI:        Math.round(totalEMI),
      propFutureValue: Math.round(propFutureValue),
      netEquity:       Math.round(netEquity),
      buyNetPosition:  Math.round(buyNetPosition),
      totalRentPaid:   Math.round(totalRentPaid),
      oppCostFV:       Math.round(oppCostFV),
      rentNetPosition: Math.round(rentNetPosition),
      breakEvenYear,
      buyWins:         buyNetPosition > rentNetPosition,
    };
  }, [propertyPrice, downPaymentPct, homeLoanRate, tenure, monthlyRent, rentGrowth,
      propertyGrowth, stampDuty, maintPct, investReturn, horizon]);

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Rent vs Buy Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Housing Decision</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Rent vs Buy<br />
            <em className="italic">Calculator</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            True {horizon}-year comparison. Includes opportunity cost, stamp duty, maintenance, and break-even year.
          </p>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Property Details</p>
          <NumberInput label="Property Price" value={propertyPrice} onChange={setProperty} />
          <SliderField label="Down Payment" value={downPaymentPct} min={10} max={80} unit="%" onChange={setDownPct} />
          <SliderField label="Home Loan Interest Rate" value={homeLoanRate} min={6} max={15} step={0.25} unit="%" onChange={setHomeLoan} />
          <SliderField label="Loan Tenure" value={tenure} min={5} max={30} unit=" yrs" onChange={setTenure} />
          <SliderField label="Property Value Growth" value={propertyGrowth} min={1} max={15} unit="%" onChange={setPropGrowth} />
          <SliderField label="Stamp Duty" value={stampDuty} min={2} max={8} unit="%" onChange={setStampDuty} />
          <SliderField label="Annual Maintenance" value={maintPct} min={0} max={2} step={0.1} unit="%" onChange={setMaint} />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">Renting Alternative</p>
          <NumberInput label="Current Monthly Rent" value={monthlyRent} onChange={setRent} />
          <SliderField label="Annual Rent Growth" value={rentGrowth} min={0} max={15} unit="%" onChange={setRentGrowth} />
          <SliderField label="Inv. Return if Down Payment Invested" value={investReturn} min={6} max={20} unit="%" onChange={setInvReturn} />
          <SliderField label="Comparison Horizon" value={horizon} min={5} max={30} unit=" yrs" onChange={setHorizon} />
        </div>
      </section>

      <section aria-label="Rent vs Buy Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-1">Monthly EMI</p>
          <p className="result-amount animate-result">{formatINR(results.emi)}</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Upfront Cost</p>
              <p className="result-amount-sm">{formatINRLakh(results.upfrontCost)}</p>
              <p className="text-xs text-on-surface-var opacity-50 mt-1">
                Down: {formatINRLakh(results.downPayment)} + Stamp: {formatINRLakh(results.stampDutyAmt)}
              </p>
            </div>
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">Property in {horizon}yr</p>
              <p className="result-amount-sm sage-text">{formatINRLakh(results.propFutureValue)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="section-card">
            <p className="label-overline mango-text mb-2">Buy Net Position in {horizon}yr</p>
            <p className={`result-amount-sm ${results.buyNetPosition >= 0 ? 'sage-text' : 'text-danger'}`}>
              {results.buyNetPosition >= 0 ? '+' : ''}{formatINRLakh(results.buyNetPosition)}
            </p>
            <p className="text-xs text-on-surface-var opacity-60 mt-2">
              Equity minus all buying costs
            </p>
          </div>
          <div className="section-card">
            <p className="label-overline lavender-text mb-2">Rent Net Position in {horizon}yr</p>
            <p className={`result-amount-sm ${results.rentNetPosition >= 0 ? 'sage-text' : 'text-danger'}`}>
              {results.rentNetPosition >= 0 ? '+' : ''}{formatINRLakh(results.rentNetPosition)}
            </p>
            <p className="text-xs text-on-surface-var opacity-60 mt-2">
              Down payment invested minus rent
            </p>
          </div>
        </div>

        <div className="cost-of-waiting mt-2">
          <p className="label-overline mb-1 text-primary-container">
            {results.buyWins ? '🏠 Buying Wins' : '🏡 Renting Wins'} over {horizon} years
          </p>
          <p className="text-sm text-on-surface">
            {results.buyWins
              ? `Buying puts you ahead by ${formatINRLakh(results.buyNetPosition - results.rentNetPosition)} over ${horizon} years.`
              : `Renting and investing the down payment puts you ahead by ${formatINRLakh(results.rentNetPosition - results.buyNetPosition)} over ${horizon} years.`}
          </p>
          {results.breakEvenYear && (
            <p className="text-xs sage-text mt-2">
              Break-even year: Year {results.breakEvenYear} — buying equity surpasses renting alternative.
            </p>
          )}
        </div>

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          Assumes investment return of {investReturn}% for opportunity cost. Property growth is notional.
          Actual returns depend on location, timing, and market conditions. Educational purposes only.
        </p>
      </section>
    </div>
  );
}
