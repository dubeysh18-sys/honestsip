import React, { useState } from 'react';
import { realWorldTranslation } from '../lib/ruleEngine';
import { formatINR } from '../lib/ruleEngine';

const TRANSLATIONS = [
  {
    id: 'lifestyle',
    icon: '☀️',
    label: 'Years of Lifestyle Freedom',
    getValue: (t) => `${t.lifestyleYears} years`,
    sub: 'At your current monthly expenses',
  },
  {
    id: 'house',
    icon: '🏠',
    label: 'House Down Payment',
    getValue: (t) => `${t.housePercent}% of a 2BHK`,
    sub: 'In your selected city',
  },
  {
    id: 'trips',
    icon: '✈️',
    label: 'International Trips',
    getValue: (t) => `${t.internationalTrips} trips`,
    sub: 'Over the next 10 years',
  },
  {
    id: 'retirement',
    icon: '🌅',
    label: 'Years of Retirement',
    getValue: (t) => `${t.retirementYears} years`,
    sub: '@ 3.5% Safe Withdrawal Rate',
  },
  {
    id: 'education',
    icon: '🎓',
    label: 'Education Funded',
    getValue: (t) => `${t.educationYears > 0 ? `${t.educationYears}x full courses` : 'N/A'}`,
    sub: 'Private engineering degree',
  },
];

export default function RealWorldTranslation({
  corpus,
  yearsFromNow,
  monthlyExpense = 50000,
  inflationRate = 0.06,
}) {
  const [active, setActive] = useState(null);

  if (!corpus || corpus <= 0) return null;

  const t = realWorldTranslation({
    corpus,
    monthlyExpense,
    cityPropertyPricePerSqft: 8000,
    educationCourseFeeInflated: 1200000 * Math.pow(1.10, yearsFromNow),
    tripCost: 200000,
    yearsFromNow,
    inflationRate,
    swrRate: 0.035,
  });

  return (
    <div className="mt-6">
      <p className="label-overline text-on-surface-var mb-3">🌍 What This Corpus Buys</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TRANSLATIONS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(isActive ? null : item.id)}
              className={`text-left rounded-xl p-3 transition-all border ${
                isActive 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-surface-high border-transparent hover:bg-surface-highest/50'
              }`}
            >
              <p className="text-xl mb-1">{item.icon}</p>
              <p className="font-serif text-lg mango-text leading-tight">
                {item.getValue(t)}
              </p>
              <p className="text-xs text-on-surface-var mt-1 opacity-70 leading-snug">
                {item.label}
              </p>
              {isActive && (
                <p className="text-xs sage-text mt-1">{item.sub}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
