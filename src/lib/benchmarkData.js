/**
 * Peer Benchmarking Data
 * Sources: WID India 2024, AMFI/CRISIL 2024, RBI FSR, PLFS 2023-24
 */

// Income percentiles — urban salaried Indians (monthly take-home)
// Based on WID India 2024 & CBDT ITR data
export const INCOME_PERCENTILES = [
  { bracket: 'under-25k',   label: 'Under ₹25,000/mo',       midpoint: 15000,  p50SIP: 1200,  p75SIP: 2500,  percentile: 30  },
  { bracket: '25k-50k',     label: '₹25,000 – ₹50,000/mo',   midpoint: 37500,  p50SIP: 2500,  p75SIP: 5000,  percentile: 55  },
  { bracket: '50k-1l',      label: '₹50,000 – ₹1,00,000/mo', midpoint: 75000,  p50SIP: 5200,  p75SIP: 10000, percentile: 75  },
  { bracket: '1l-2l',       label: '₹1,00,000 – ₹2,00,000/mo',midpoint:150000, p50SIP: 12000, p75SIP: 25000, percentile: 88  },
  { bracket: '2l-5l',       label: '₹2,00,000 – ₹5,00,000/mo',midpoint:350000, p50SIP: 30000, p75SIP: 60000, percentile: 96  },
  { bracket: 'above-5l',    label: 'Above ₹5,00,000/mo',      midpoint: 750000, p50SIP: 75000, p75SIP: 150000,percentile: 99  },
];

// Average SIP per account: ₹2,200–₹2,500 (AMFI 2024)
// Urban salaried practical average: ₹4,000–₹8,000
export const SIP_BENCHMARKS = {
  nationalAvg: 2350,
  urbanSalariedAvg: 5500,
  urbanSalariedP75: 10000,
};

// Employment type → recommended emergency fund months + rationale
export const EMERGENCY_FUND_BENCHMARKS = {
  'govt':        { months: 3,  label: 'Govt / PSU',       rationale: 'Lowest job risk, pensionable' },
  'large-mnc':   { months: 4,  label: 'Large MNC',        rationale: 'Stable but notice period risk' },
  'mid-company':  { months: 5,  label: 'Mid-size company', rationale: 'Higher volatility' },
  'startup':     { months: 6,  label: 'Startup',          rationale: 'Funding-dependent' },
  'freelance':   { months: 9,  label: 'Freelance / Gig',  rationale: 'Irregular income' },
  'self-employed':{ months: 12, label: 'Self-employed',   rationale: 'No employer support' },
};

// Goal defaults per PRD §2.3
export const GOAL_DEFAULTS = {
  'child-education': {
    label: "Child's Education",
    defaultCost: 2000000,
    inflation: 0.10,
    emoji: '🎓',
    note: 'Education inflation in India: 10–11% (EY-CII 2023)',
  },
  'child-marriage': {
    label: "Child's Marriage",
    defaultCost: 1500000,
    inflation: 0.08,
    emoji: '💍',
    note: 'Wedding costs rising ~8% annually in urban India',
  },
  'house-down': {
    label: 'House Down Payment',
    defaultCost: 2500000,
    inflation: 0.07,
    emoji: '🏠',
    note: 'Urban property inflation ~7% historically',
  },
  'foreign-trip': {
    label: 'Foreign Trip',
    defaultCost: 300000,
    inflation: 0.05,
    emoji: '✈️',
    note: 'International travel inflation ~5%',
  },
  'car': {
    label: 'Car Purchase',
    defaultCost: 800000,
    inflation: 0.05,
    emoji: '🚗',
    note: 'Auto inflation ~5% for petrol/EV mix',
  },
  'business': {
    label: 'Start a Business',
    defaultCost: 1000000,
    inflation: 0.06,
    emoji: '💼',
    note: 'General business setup costs',
  },
  'medical-emergency': {
    label: 'Medical Emergency Fund',
    defaultCost: 500000,
    inflation: 0.08,
    emoji: '🏥',
    note: 'Healthcare inflation India: ~8%',
  },
  'retirement': {
    label: 'Retirement',
    defaultCost: null, // calculated from age
    inflation: 0.06,
    emoji: '🌅',
    note: 'Use Retirement Planner for accurate calculation',
  },
};

// Course defaults for Child Education (PRD §2.5)
export const EDUCATION_COURSES = [
  { id: 'engineering-pvt', label: 'Engineering (Private)', totalFee: 1200000, inflation: 0.10, years: 4 },
  { id: 'mbbs-pvt',        label: 'MBBS (Private)',        totalFee: 5000000, inflation: 0.12, years: 5 },
  { id: 'mba-iim',         label: 'MBA (IIM-tier)',        totalFee: 2500000, inflation: 0.10, years: 2 },
  { id: 'abroad-ug',       label: 'Abroad (UG)',           totalFee: 8000000, inflation: 0.08, years: 4, note: '+ INR depreciation ~3%' },
];

// SIP Amount Percentile calculator
export function sipAmountPercentile(monthlyIncomeBracket, sipAmount) {
  const bracket = INCOME_PERCENTILES.find(b => b.bracket === monthlyIncomeBracket);
  if (!bracket) return { percentile: 50, label: 'Average', peerAvg: 5200 };

  const peerAvg = bracket.p50SIP;
  const peer75  = bracket.p75SIP;

  let percentile;
  if (sipAmount <= 0)           percentile = 0;
  else if (sipAmount < peerAvg) percentile = Math.round((sipAmount / peerAvg) * 50);
  else if (sipAmount < peer75)  percentile = Math.round(50 + ((sipAmount - peerAvg) / (peer75 - peerAvg)) * 25);
  else                          percentile = Math.min(99, Math.round(75 + ((sipAmount - peer75) / peer75) * 20));

  let label;
  if (percentile < 25)      label = 'Below Average';
  else if (percentile < 50) label = 'Average';
  else if (percentile < 75) label = 'Above Average';
  else if (percentile < 90) label = 'Top Saver';
  else                      label = 'Elite Saver';

  return { percentile, label, peerAvg, peer75, midpoint: bracket.midpoint };
}

// Net worth percentile (rough estimate based on age and income)
export function netWorthPercentile(netWorth, age, annualIncome) {
  const { medianLow, medianHigh, goodLow, goodHigh } = netWorthBenchmarkImport(age);
  const multiple = annualIncome > 0 ? netWorth / annualIncome : 0;

  let percentile, label, status;
  if (multiple < medianLow)      { percentile = 20; label = 'Behind'; status = 'red'; }
  else if (multiple < medianHigh){ percentile = 50; label = 'On Track'; status = 'yellow'; }
  else if (multiple < goodLow)   { percentile = 70; label = 'Good'; status = 'green'; }
  else if (multiple < goodHigh)  { percentile = 90; label = 'Excellent'; status = 'green'; }
  else                           { percentile = 97; label = 'Elite'; status = 'green'; }

  return { percentile, label, status, multiple: Math.round(multiple * 10) / 10, medianLow, medianHigh, goodLow, goodHigh };
}

// Local import to avoid circular dependency
function netWorthBenchmarkImport(age) {
  const NW = [
    { age: 25, medianLow: 0.3,  medianHigh: 0.5,  goodLow: 1.0,  goodHigh: 2.0  },
    { age: 30, medianLow: 0.5,  medianHigh: 1.5,  goodLow: 2.5,  goodHigh: 4.0  },
    { age: 35, medianLow: 1.0,  medianHigh: 3.0,  goodLow: 5.0,  goodHigh: 8.0  },
    { age: 40, medianLow: 2.0,  medianHigh: 5.0,  goodLow: 8.0,  goodHigh: 12.0 },
    { age: 45, medianLow: 3.0,  medianHigh: 7.0,  goodLow: 11.0, goodHigh: 16.0 },
    { age: 50, medianLow: 5.0,  medianHigh: 10.0, goodLow: 15.0, goodHigh: 22.0 },
    { age: 55, medianLow: 7.0,  medianHigh: 14.0, goodLow: 20.0, goodHigh: 28.0 },
    { age: 60, medianLow: 10.0, medianHigh: 18.0, goodLow: 25.0, goodHigh: 35.0 },
  ];
  if (age <= 25) return NW[0];
  if (age >= 60) return NW[NW.length - 1];
  for (let j = 0; j < NW.length - 1; j++) {
    const lo = NW[j], hi = NW[j + 1];
    if (age >= lo.age && age <= hi.age) {
      const t = (age - lo.age) / (hi.age - lo.age);
      return {
        medianLow:  lo.medianLow  + t * (hi.medianLow  - lo.medianLow),
        medianHigh: lo.medianHigh + t * (hi.medianHigh - lo.medianHigh),
        goodLow:    lo.goodLow    + t * (hi.goodLow    - lo.goodLow),
        goodHigh:   lo.goodHigh   + t * (hi.goodHigh   - lo.goodHigh),
      };
    }
  }
  return NW[NW.length - 1];
}

// Income percentile lookup
export function incomePercentile(monthlyIncome) {
  if (monthlyIncome < 25000)  return { percentile: 30, label: 'Entry Level' };
  if (monthlyIncome < 50000)  return { percentile: 55, label: 'Mid Junior' };
  if (monthlyIncome < 100000) return { percentile: 75, label: 'Urban Salaried' };
  if (monthlyIncome < 200000) return { percentile: 88, label: 'Senior Professional' };
  if (monthlyIncome < 500000) return { percentile: 96, label: 'Leadership' };
  return { percentile: 99, label: 'Top Earner' };
}

// Financial Health Score weights (PRD §2.8)
export const FH_WEIGHTS = {
  savingsRate:     20,
  emergencyFund:   20,
  debtToIncome:    20,
  netWorthVsPeer:  20,
  insurance:       15,
  financialHygiene: 5,
};

export function computeFinancialHealthScore({
  savingsRate,         // 0–1 (e.g. 0.20 = 20%)
  emergencyMonths,     // how many months user has
  recommendedEFMonths, // benchmark
  foir,                // debt-to-income ratio 0–1
  netWorthMultiple,    // current multiple
  medianMultiple,      // benchmark median multiple
  hasTermInsurance,
  hasMedicalInsurance,
  termCoverAdequate,   // boolean
  hasWill,
  hasNominations,
  filesTaxes,
}) {
  // Savings Rate: 20% savings → 20pts, linear
  const srScore = Math.min(20, (savingsRate / 0.30) * 20);

  // Emergency Fund: full if >= recommended, partial otherwise
  const efRatio = emergencyMonths / Math.max(recommendedEFMonths, 1);
  const efScore = Math.min(20, efRatio * 20);

  // Debt-to-Income (FOIR): <30% = full, 30-50% = partial, >50% = 0
  let foirScore = 0;
  if (foir <= 0.30) foirScore = 20;
  else if (foir <= 0.50) foirScore = Math.round(20 * (1 - (foir - 0.30) / 0.20));
  else foirScore = 0;

  // Net worth vs peer: at median = 10pts, at good = 20pts
  const nwRatio = medianMultiple > 0 ? netWorthMultiple / medianMultiple : 0;
  const nwScore = Math.min(20, nwRatio * 10);

  // Insurance: term + medical, adequacy
  let insurScore = 0;
  if (hasMedicalInsurance) insurScore += 5;
  if (hasTermInsurance)    insurScore += 5;
  if (termCoverAdequate)   insurScore += 5;
  insurScore = Math.min(15, insurScore);

  // Financial Hygiene
  let hygieneScore = 0;
  if (hasWill)          hygieneScore += 2;
  if (hasNominations)   hygieneScore += 2;
  if (filesTaxes)       hygieneScore += 1;
  hygieneScore = Math.min(5, hygieneScore);

  const total = Math.round(srScore + efScore + foirScore + nwScore + insurScore + hygieneScore);
  const grade = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B+' : total >= 60 ? 'B' : total >= 50 ? 'C' : total >= 40 ? 'D+' : 'D';

  return {
    total,
    grade,
    dimensions: {
      savingsRate:     Math.round(srScore),
      emergencyFund:   Math.round(efScore),
      debtToIncome:    Math.round(foirScore),
      netWorthVsPeer:  Math.round(nwScore),
      insurance:       Math.round(insurScore),
      financialHygiene: Math.round(hygieneScore),
    },
  };
}
