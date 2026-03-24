import React, { useState, useMemo } from 'react';
import NumberInput from '../components/NumberInput';
import SliderField from '../components/SliderField';
import { formatINR, formatINRLakh } from '../lib/ruleEngine';

const CITY_TIERS = {
  tier1: { label: 'Metro (Mumbai, Delhi, Bengaluru)',   rent: 0.35, food: 0.20, transport: 0.10, leisure: 0.15, savings: 0.20 },
  tier2: { label: 'Tier 2 (Pune, Hyderabad, Ahmedabad)', rent: 0.28, food: 0.22, transport: 0.10, leisure: 0.15, savings: 0.25 },
  tier3: { label: 'Tier 3 & Others',                    rent: 0.20, food: 0.25, transport: 0.10, leisure: 0.15, savings: 0.30 },
};

const CATEGORIES = [
  { key: 'needs',   label: 'Needs',   color: 'mango-text',    target: 50, desc: 'Rent, food, utilities, transport, insurance' },
  { key: 'wants',   label: 'Wants',   color: 'lavender-text', target: 30, desc: 'Dining out, streaming, leisure, shopping' },
  { key: 'savings', label: 'Savings', color: 'sage-text',     target: 20, desc: 'SIP, emergency fund, investments, loan repayment' },
];

export default function SalaryLifestyle() {
  const [income, setIncome]       = useState(75000);
  const [rent, setRent]           = useState(20000);
  const [food, setFood]           = useState(10000);
  const [utilities, setUtilities] = useState(5000);
  const [transport, setTransport] = useState(5000);
  const [insurance, setInsurance] = useState(3000);
  const [dining, setDining]       = useState(5000);
  const [leisure, setLeisure]     = useState(5000);
  const [shopping, setShopping]   = useState(5000);
  const [actualSavings, setActualSavings] = useState(17000);

  const results = useMemo(() => {
    const needs   = rent + food + utilities + transport + insurance;
    const wants   = dining + leisure + shopping;
    const savings = actualSavings;
    const total   = needs + wants + savings;

    const needsPct   = income > 0 ? Math.round(needs   / income * 100) : 0;
    const wantsPct   = income > 0 ? Math.round(wants   / income * 100) : 0;
    const savingsPct = income > 0 ? Math.round(savings / income * 100) : 0;

    const surplus = income - (needs + wants + savings);

    return { needs, wants, savings, total, needsPct, wantsPct, savingsPct, surplus };
  }, [income, rent, food, utilities, transport, insurance, dining, leisure, shopping, actualSavings]);

  const getStatus = (actual, target) => {
    const diff = actual - target;
    if (Math.abs(diff) <= 5) return { label: 'On target', cls: 'badge-green' };
    if (diff > 5) return { label: 'Overspending', cls: 'badge-red' };
    return { label: 'Under budget', cls: 'badge-green' };
  };

  const bars = [
    { key: 'needs',   actual: results.needsPct,   target: 50, label: 'Needs',   color: '#ffb77d' },
    { key: 'wants',   actual: results.wantsPct,   target: 30, label: 'Wants',   color: '#cebefa' },
    { key: 'savings', actual: results.savingsPct, target: 20, label: 'Savings', color: '#bdcca3' },
  ];

  return (
    <div className="page-section pb-28 md:pb-12">
      <section aria-label="Salary Lifestyle Inputs">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Salary-to-Lifestyle<br />
            <em className="italic">Alignment</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            The 50/30/20 rule adapted for Indian city tiers. See where you're leaking wealth.
          </p>
        </div>

        <div className="section-card mb-4">
          <NumberInput label="Monthly Take-Home" value={income} onChange={setIncome} />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline sage-text mb-4">Needs (Target: 50%)</p>
          <NumberInput label="Rent / Home Loan EMI" value={rent}      onChange={setRent} />
          <NumberInput label="Groceries & Food"      value={food}      onChange={setFood} />
          <NumberInput label="Utilities & Bills"     value={utilities} onChange={setUtilities} />
          <NumberInput label="Transport & Fuel"      value={transport} onChange={setTransport} />
          <NumberInput label="Insurance Premiums"    value={insurance} onChange={setInsurance} />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline lavender-text mb-4">Wants (Target: 30%)</p>
          <NumberInput label="Dining Out & Delivery"  value={dining}   onChange={setDining} />
          <NumberInput label="Entertainment & Leisure" value={leisure} onChange={setLeisure} />
          <NumberInput label="Shopping & Subscriptions" value={shopping} onChange={setShopping} />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline sage-text mb-4">Savings & Investments (Target: 20%)</p>
          <NumberInput label="SIP + Emergency Fund + All Investments" value={actualSavings} onChange={setActualSavings} />
        </div>
      </section>

      <section aria-label="Lifestyle Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">50/30/20 Analysis</p>
          <div className="space-y-5">
            {bars.map(b => {
              const st = getStatus(b.actual, b.target);
              return (
                <div key={b.key}>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm text-on-surface font-medium">{b.label}</p>
                    <div className="flex items-center gap-2">
                      <span className={st.cls}>{st.label}</span>
                      <p className="text-sm font-bold" style={{ color: b.color }}>{b.actual}%</p>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-surface-highest">
                    <div className="absolute top-0 left-0 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, b.actual)}%`, background: b.color }} />
                    {/* Target marker */}
                    <div className="absolute top-0 h-2 w-px bg-white opacity-30"
                      style={{ left: `${b.target}%` }} />
                  </div>
                  <p className="text-xs text-on-surface-var opacity-50 mt-0.5">Target: {b.target}%</p>
                </div>
              );
            })}
          </div>

          {results.surplus !== 0 && (
            <div className="inner-card mt-4 flex justify-between items-center">
              <p className="text-sm text-on-surface-var">Monthly Surplus / Shortfall</p>
              <p className={`font-serif text-xl ${results.surplus >= 0 ? 'sage-text' : 'text-danger'}`}>
                {results.surplus >= 0 ? '+' : ''}{formatINR(results.surplus)}
              </p>
            </div>
          )}
        </div>

        <div className="glass-card p-4 mt-4">
          <p className="label-overline lavender-text mb-2">💡 Smart Nudge</p>
          <p className="text-sm text-on-surface-var leading-relaxed">
            {results.savingsPct < 20
              ? `You're saving ${results.savingsPct}% vs the 20% target. Every 1% more = ${formatINR(income * 0.01)}/month in extra SIP. Over 10 years at 12% that's ${formatINRLakh(income * 0.01 * 1.12 * 132)} extra corpus.`
              : `You're saving ${results.savingsPct}% — above the 20% benchmark. Excellent financial discipline. Consider increasing your SIP step-up by 5%.`}
          </p>
        </div>

      </section>
    </div>
  );
}
