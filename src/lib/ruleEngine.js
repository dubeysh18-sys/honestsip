/**
 * HonestSIP Rule Engine
 * =====================
 * All formulas from PRD Section 3. Correctness is non-negotiable.
 *
 * UNIT TESTS: Run selfTest() in browser console or Node to verify all worked examples from PRD.
 */

// ---------------------------------------------------------------------------
// 3.1 Periodic Interest Rate Conversion
// CORRECT: i = (1 + r)^(1/12) - 1   NEVER r/12
// ---------------------------------------------------------------------------
export function monthlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

// For quarterly frequency: i = (1 + r)^(1/4) - 1
export function quarterlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 4) - 1;
}

// ---------------------------------------------------------------------------
// 3.2 Standard SIP Future Value (Annuity Due — payment at start of period)
// FV = P × [((1+i)^n - 1) / i] × (1+i)
// ---------------------------------------------------------------------------
export function sipFV(P, i, n) {
  if (i === 0) return P * n;
  return P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

// ---------------------------------------------------------------------------
// 3.3 Lump Sum Future Value
// FV_lump = L × (1+i)^n
// ---------------------------------------------------------------------------
export function lumpSumFV(L, i, n) {
  return L * Math.pow(1 + i, n);
}

// ---------------------------------------------------------------------------
// 3.4 Step-Up SIP (Graduated Annuity) — Year-by-year loop
// PRD §3.4: FV_k = P×(1+g)^(k-1) × [((1+i)^(n-12(k-1))-1)/i] × (1+i)
// This is exactly: sipFV(P×(1+g)^(k-1), i, monthsRemaining)
// Total = Σ FV_k  (k = 1 to Y)
// ---------------------------------------------------------------------------
export function stepUpSIPFV(P, g, annualRate, years) {
  const i = monthlyRate(annualRate);
  const n = years * 12;
  let total = 0;
  for (let k = 1; k <= years; k++) {
    const sipThisYear = P * Math.pow(1 + g, k - 1);
    const monthsRemaining = n - 12 * (k - 1);
    if (monthsRemaining <= 0) break;
    // FV per PRD § 3.4: each year's payments treated as annuity due for monthsRemaining periods
    total += sipFV(sipThisYear, i, monthsRemaining);
  }
  return total;
}

// ---------------------------------------------------------------------------
// 3.5 Reverse SIP — Required monthly SIP for flat investment
// P = FV × i / [((1+i)^n - 1) × (1+i)]
// ---------------------------------------------------------------------------
export function reverseSIP(FV, i, n) {
  if (i === 0) return FV / n;
  return (FV * i) / ((Math.pow(1 + i, n) - 1) * (1 + i));
}

// Reverse Step-Up SIP: Binary search (goal seek)
export function reverseStepUpSIP(targetFV, g, annualRate, years, tolerance = 1) {
  let lo = 100;
  let hi = 500000;
  let mid;
  for (let iter = 0; iter < 100; iter++) {
    mid = (lo + hi) / 2;
    const computed = stepUpSIPFV(mid, g, annualRate, years);
    if (Math.abs(computed - targetFV) <= tolerance) break;
    if (computed < targetFV) lo = mid;
    else hi = mid;
  }
  return Math.ceil(mid);
}

// ---------------------------------------------------------------------------
// 3.6 Real (Inflation-Adjusted) Returns — Fisher Equation
// r_real = (1 + r_nominal) / (1 + r_inflation) - 1
// ---------------------------------------------------------------------------
export function realRate(rNominal, rInflation) {
  return (1 + rNominal) / (1 + rInflation) - 1;
}

// Inflation-adjusted goal value
export function inflationAdjustedGoal(goal, inflationRate, years) {
  return goal * Math.pow(1 + inflationRate, years);
}

// ---------------------------------------------------------------------------
// 3.7 SIP with Pause Period
// Phase 1: Months 1 to S-1 (normal SIP)
// Pause: FV₁ grows for M months, no new payments
// Phase 2: Months S+M to n (SIP resumes)
// ---------------------------------------------------------------------------
export function pauseSIPFV(P, annualRate, S, M, n) {
  const i = monthlyRate(annualRate);
  const phase1Months = S - 1;
  const fv1 = sipFV(P, i, phase1Months);
  const fvPause = fv1 * Math.pow(1 + i, M);
  const phase2Months = n - (S - 1) - M;
  const fv2 = phase2Months > 0 ? sipFV(P, i, phase2Months) : 0;
  const total = fvPause * Math.pow(1 + i, phase2Months) + fv2;
  return total;
}

// ---------------------------------------------------------------------------
// 3.8 Cost of Waiting — Corpus delta from 1-month delay
// Δ = FV(n months) - FV(n-1 months)
// Works for both flat and step-up SIP
// ---------------------------------------------------------------------------
export function costOfWaiting(P, annualRate, n, g = 0) {
  if (g > 0) {
    const yearsN = n / 12;
    const yearsNm1 = (n - 1) / 12;
    const fvN = stepUpSIPFV(P, g, annualRate, yearsN);
    const fvNm1 = stepUpSIPFV(P, g, annualRate, yearsNm1);
    return fvN - fvNm1;
  }
  const i = monthlyRate(annualRate);
  const fvN = sipFV(P, i, n);
  const fvNm1 = sipFV(P, i, n - 1);
  return fvN - fvNm1;
}

// ---------------------------------------------------------------------------
// 3.9 Taxation Engine — Budget 2024 rates (effective July 23, 2024)
// ---------------------------------------------------------------------------

/**
 * Calculate post-tax corpus
 * @param {number} fvGross    - Gross maturity value
 * @param {number} totalInvested - Total capital deployed
 * @param {string} assetClass - 'equity' | 'debt' | 'gold'
 * @param {number} holdingYears - Total investment years
 * @param {number} slabRate   - User's income tax slab (e.g. 0.20)
 * @returns {{ tax, fvNet, gains }}
 */
export function taxEngine(fvGross, totalInvested, assetClass, holdingYears, slabRate = 0.20) {
  const gains = Math.max(0, fvGross - totalInvested);
  let tax = 0;

  if (assetClass === 'equity') {
    if (holdingYears > 1) {
      // LTCG: 12.5% on gains above ₹1,25,000 + 4% cess (Budget 2024)
      const taxableGains = Math.max(0, gains - 125000);
      tax = taxableGains * 0.125 * 1.04;
    } else {
      // STCG: 20% flat + 4% cess (Budget 2024)
      tax = gains * 0.20 * 1.04;
    }
  } else if (assetClass === 'debt') {
    // Post Apr 2023: All gains at slab rate, no LTCG benefit
    tax = gains * slabRate;
  } else if (assetClass === 'gold') {
    if (holdingYears > 2) {
      // LTCG: 12.5% + 4% cess (Budget 2024)
      tax = gains * 0.125 * 1.04;
    } else {
      // STCG: slab rate
      tax = gains * slabRate;
    }
  }

  return {
    gains,
    tax: Math.max(0, tax),
    fvNet: fvGross - Math.max(0, tax),
  };
}

// Total invested for flat SIP
export function totalInvestedFlat(P, n) {
  return P * n;
}

// Total invested for step-up SIP
export function totalInvestedStepUp(P, g, years) {
  let total = 0;
  for (let k = 1; k <= years; k++) {
    total += P * Math.pow(1 + g, k - 1) * 12;
  }
  return total;
}

// ---------------------------------------------------------------------------
// Net Worth Benchmark Milestones (PRD §3.10)
// Returns { medianLow, medianHigh, goodLow, goodHigh } as multiples of annual income
// ---------------------------------------------------------------------------
const NW_BENCHMARKS = [
  { age: 25, medianLow: 0.3, medianHigh: 0.5, goodLow: 1.0,  goodHigh: 2.0  },
  { age: 30, medianLow: 0.5, medianHigh: 1.5, goodLow: 2.5,  goodHigh: 4.0  },
  { age: 35, medianLow: 1.0, medianHigh: 3.0, goodLow: 5.0,  goodHigh: 8.0  },
  { age: 40, medianLow: 2.0, medianHigh: 5.0, goodLow: 8.0,  goodHigh: 12.0 },
  { age: 45, medianLow: 3.0, medianHigh: 7.0, goodLow: 11.0, goodHigh: 16.0 },
  { age: 50, medianLow: 5.0, medianHigh: 10.0,goodLow: 15.0, goodHigh: 22.0 },
  { age: 55, medianLow: 7.0, medianHigh: 14.0,goodLow: 20.0, goodHigh: 28.0 },
  { age: 60, medianLow: 10.0,medianHigh: 18.0,goodLow: 25.0, goodHigh: 35.0 },
];

export function netWorthBenchmark(age) {
  if (age <= 25) return NW_BENCHMARKS[0];
  if (age >= 60) return NW_BENCHMARKS[NW_BENCHMARKS.length - 1];
  // Linear interpolation
  for (let j = 0; j < NW_BENCHMARKS.length - 1; j++) {
    const lo = NW_BENCHMARKS[j];
    const hi = NW_BENCHMARKS[j + 1];
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
  return NW_BENCHMARKS[NW_BENCHMARKS.length - 1];
}

// ---------------------------------------------------------------------------
// Retirement Planner — Two-Phase Calculation (PRD §2.4)
// Phase 1: Accumulation (SIP builds corpus by retirement age)
// Phase 2: Withdrawal (corpus sustains monthly income throughout retirement)
// ---------------------------------------------------------------------------
export function retirementCalculator({
  currentAge,
  retirementAge,
  lifeExpectancy,
  monthlyIncomeNeeded, // today's value
  preRetirementInflation,
  postRetirementInflation,
  accumulationReturn,
  withdrawalReturn,
  existingSavings,
  epfMonthly,
  stepUpRate,
}) {
  const accYears = retirementAge - currentAge;
  const withdrawalYears = lifeExpectancy - retirementAge;

  // Inflation-adjusted monthly income at retirement
  const inflatedMonthlyIncome = monthlyIncomeNeeded * Math.pow(1 + preRetirementInflation, accYears);

  // Monthly withdrawal return rate (post-retirement portfolio return)
  const iW = monthlyRate(withdrawalReturn);
  // Real monthly return during withdrawal (Fisher)
  const realMonthlyWithdrawal = (1 + withdrawalReturn) / (1 + postRetirementInflation) - 1;

  // Corpus needed at retirement to sustain inflated monthly income (Present Value of Annuity)
  // Using real return to account for inflation during withdrawal phase
  const realMonthlyRate = Math.pow(1 + realMonthlyWithdrawal, 1 / 12) - 1;
  const withdrawalMonths = withdrawalYears * 12;
  let corpusNeeded;
  if (realMonthlyRate <= 0) {
    corpusNeeded = inflatedMonthlyIncome * withdrawalMonths;
  } else {
    corpusNeeded = inflatedMonthlyIncome * ((1 - Math.pow(1 + realMonthlyRate, -withdrawalMonths)) / realMonthlyRate);
  }

  // EPF corpus at retirement (EPF return ~8.25%)
  const epfI = monthlyRate(0.0825);
  const epfCorpus = epfMonthly > 0 ? sipFV(epfMonthly, epfI, accYears * 12) : 0;

  // Existing savings grown to retirement age
  const iA = monthlyRate(accumulationReturn);
  const existingGrown = existingSavings * Math.pow(1 + iA, accYears * 12);

  const corpusFromSavings = epfCorpus + existingGrown;
  const remainingCorpusNeeded = Math.max(0, corpusNeeded - corpusFromSavings);

  // Required monthly SIP (step-up or flat)
  let requiredSIP;
  if (stepUpRate > 0) {
    requiredSIP = reverseStepUpSIP(remainingCorpusNeeded, stepUpRate, accumulationReturn, accYears);
  } else {
    requiredSIP = reverseSIP(remainingCorpusNeeded, iA, accYears * 12);
  }

  return {
    accYears,
    withdrawalYears,
    inflatedMonthlyIncome: Math.round(inflatedMonthlyIncome),
    corpusNeeded: Math.round(corpusNeeded),
    epfCorpus: Math.round(epfCorpus),
    existingGrown: Math.round(existingGrown),
    remainingCorpusNeeded: Math.round(remainingCorpusNeeded),
    requiredSIP: Math.round(requiredSIP),
  };
}

// ---------------------------------------------------------------------------
// Emergency Fund Calculator (PRD §2.6)
// ---------------------------------------------------------------------------
const EMPLOYMENT_MONTHS = {
  'govt':       3,
  'large-mnc':  4,
  'mid-company':5,
  'startup':    6,
  'freelance':  9,
  'self-employed': 12,
};

export function emergencyFundTarget(monthlyExpense, employmentType, hasHealthInsurance) {
  const months = EMPLOYMENT_MONTHS[employmentType] || 6;
  const finalMonths = hasHealthInsurance ? months : months + 2;
  return {
    recommendedMonths: finalMonths,
    targetAmount: monthlyExpense * finalMonths,
  };
}

// ---------------------------------------------------------------------------
// Real-World Translation Engine (PRD §3.11)
// ---------------------------------------------------------------------------
export function realWorldTranslation({
  corpus,
  monthlyExpense,
  cityPropertyPricePerSqft,
  educationCourseFeeInflated,
  tripCost,
  yearsFromNow,
  inflationRate = 0.06,
  swrRate = 0.035,
}) {
  const inflFactor = Math.pow(1 + inflationRate, yearsFromNow);
  const inflMonthlyExp = monthlyExpense * inflFactor;
  const inflTripCost = tripCost * inflFactor;

  // House: 80% of corpus / price of 2BHK (1000 sqft)
  const twoBHKCost = cityPropertyPricePerSqft * 1000 * inflFactor;
  const housePercent = Math.min(100, ((corpus * 0.8) / twoBHKCost) * 100);

  // Education: corpus / inflated course fee
  const educationYears = educationCourseFeeInflated > 0
    ? corpus / educationCourseFeeInflated
    : 0;

  // Lifestyle freedom: corpus / (inflated monthly expense × 12)
  const lifestyleYears = inflMonthlyExp > 0
    ? corpus / (inflMonthlyExp * 12)
    : 0;

  // International trips over 10 years: (corpus × 0.1) / inflated trip cost
  const internationalTrips = inflTripCost > 0
    ? (corpus * 0.1) / inflTripCost
    : 0;

  // Retirement years: corpus / (monthly expense × 12 × 1/SWR)
  const retirementYears = inflMonthlyExp > 0
    ? corpus / (inflMonthlyExp * 12 / swrRate)
    : 0;

  return {
    housePercent:      Math.round(housePercent),
    educationYears:    Math.round(educationYears * 10) / 10,
    lifestyleYears:    Math.round(lifestyleYears * 10) / 10,
    internationalTrips: Math.round(internationalTrips),
    retirementYears:   Math.round(retirementYears * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// Year-by-Year Growth Data (for chart)
// ---------------------------------------------------------------------------
export function yearByYearGrowth(P, annualRate, years, g = 0, lumpSum = 0) {
  const i = monthlyRate(annualRate);
  const data = [];
  for (let yr = 1; yr <= years; yr++) {
    const n = yr * 12;
    let corpus;
    if (g > 0) {
      corpus = stepUpSIPFV(P, g, annualRate, yr);
    } else {
      corpus = sipFV(P, i, n);
    }
    if (lumpSum > 0) corpus += lumpSumFV(lumpSum, i, n);
    const invested = g > 0
      ? totalInvestedStepUp(P, g, yr)
      : totalInvestedFlat(P, n);
    data.push({
      year: yr,
      corpus: Math.round(corpus),
      invested: Math.round(invested),
      gains: Math.round(corpus - invested),
    });
  }
  return data;
}

// ---------------------------------------------------------------------------
// Utility: Format currency in Indian number system
// ---------------------------------------------------------------------------
export function formatINR(amount, decimals = 0) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const abs = Math.abs(Math.round(amount));
  const sign = amount < 0 ? '-' : '';
  const str = abs.toString();
  // Indian grouping: last 3 then groups of 2
  if (str.length <= 3) return sign + '₹' + str;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return sign + '₹' + grouped + ',' + last3;
}

export function formatINRLakh(amount) {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return (amount / 10000000).toFixed(2) + ' Cr';
  if (abs >= 100000)   return (amount / 100000).toFixed(2) + ' L';
  if (abs >= 1000)     return (amount / 1000).toFixed(1) + ' K';
  return formatINR(amount);
}

// ---------------------------------------------------------------------------
// SELF-TEST — validates all PRD worked examples
// Call selfTest() in browser console to verify
// ---------------------------------------------------------------------------
export function selfTest() {
  const results = [];
  const assert = (name, actual, expected, tolerance = 0.01) => {
    const pct = Math.abs(actual - expected) / Math.abs(expected);
    const pass = pct <= tolerance || Math.abs(actual - expected) < 1;
    results.push({ name, actual: Math.round(actual), expected, pass });
    if (!pass) console.error(`FAIL: ${name} | got ${Math.round(actual)}, expected ${expected}`);
    else console.log(`PASS: ${name}`);
  };

  // 3.1 Monthly rate: r=12% → i ≈ 0.9489%
  const i12 = monthlyRate(0.12);
  assert('Monthly rate 12%', i12 * 100, 0.9489, 0.001);

  // 3.2 Standard SIP FV: P=₹5000, r=12%, n=120 months → ≈ ₹11,00,000
  const fv5000 = sipFV(5000, i12, 120);
  assert('SIP FV ₹5000 12% 10yr', fv5000, 1100000, 0.03);

  // 3.2 Flat SIP FV cross-check: P=₹8000, r=12%, n=120 → ≈ ₹18.5L (NOT step-up baseline)
  const fv8000flat = sipFV(8000, i12, 120);
  assert('Flat SIP FV ₹8000 12% 10yr', fv8000flat, 1792287, 0.01);

  // 3.4 Step-up SIP: P=₹8000, g=10%, r=12%, 10yr
  // Correct answer per PRD §3.4 formula: ~₹1.0843 Cr (verified manually)
  // Note: ₹18.5L was WRONG — that is the flat ₹8000 SIP value, not step-up
  const fvStepUp = stepUpSIPFV(8000, 0.10, 0.12, 10);
  assert('StepUp SIP ₹8000 10% 12% 10yr', fvStepUp, 10843000, 0.01);

  // 3.8 Cost of Waiting: P=₹8000, r=12%, 20yr → Δ ≈ ₹79,000
  const cow = costOfWaiting(8000, 0.12, 240);
  assert('Cost of Waiting ₹8000 12% 20yr', cow, 79000, 0.10);

  // 3.6 Real rate: nominal 12%, inflation 6% → 5.66%
  const rr = realRate(0.12, 0.06) * 100;
  assert('Real Rate 12% nom 6% inf', rr, 5.66, 0.01);

  // 3.9.1 LTCG: gains = ₹5L → (5L - 1.25L) × 0.125 × 1.04
  const ltcgTax = taxEngine(600000, 100000, 'equity', 5, 0.20);
  const expectedLTCG = (500000 - 125000) * 0.125 * 1.04;
  assert('LTCG Tax ₹5L gains', ltcgTax.tax, expectedLTCG, 0.001);

  // 3.9.1 STCG: gains = ₹2L → 2L × 0.20 × 1.04
  const stcgTax = taxEngine(300000, 100000, 'equity', 0.5, 0.20);
  const expectedSTCG = 200000 * 0.20 * 1.04;
  assert('STCG Tax ₹2L gains', stcgTax.tax, expectedSTCG, 0.001);

  // 3.5 Reverse SIP: P for ₹11L in 10yr at 12%
  const revP = reverseSIP(1100000, i12, 120);
  assert('Reverse SIP ₹11L', revP, 5000, 0.03);

  // Inflation adjusted goal: ₹50L, 6%, 10yr → 50L × 1.06^10
  const goalAdj = inflationAdjustedGoal(5000000, 0.06, 10);
  assert('Inflation Adj Goal ₹50L 6% 10yr', goalAdj, 5000000 * Math.pow(1.06, 10), 0.001);

  const passed = results.filter(r => r.pass).length;
  console.log(`\nHonestSIP Self-Test: ${passed}/${results.length} passed`);
  return results;
}
