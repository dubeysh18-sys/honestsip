import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ─── Tool Catalogue ─────────────────────────────────────────────────────────

const CALCULATORS = [
  { path: '/sip',          category: 'WEALTH BUILDING',  labelKey: 'menu.items.forward' },
  { path: '/reverse',      category: 'GOAL PLANNING',    labelKey: 'menu.items.reverse' },
  { path: '/lumpsum',      category: 'ONE-TIME INVEST',  labelKey: 'menu.items.lumpsum' },
  { path: '/goals',        category: 'MILESTONES',       labelKey: 'menu.items.goals' },
  { path: '/retirement',   category: 'LEGACY',           labelKey: 'menu.items.retirement' },
  { path: '/education',    category: 'EDUCATION LEGACY', labelKey: 'menu.items.education' },
  { path: '/emergency',    category: 'SAFETY NET',       labelKey: 'menu.items.emergency' },
  { path: '/networth',     category: 'SNAPSHOT',         labelKey: 'menu.items.networth' },
  { path: '/health',       category: 'DIAGNOSTIC',       labelKey: 'menu.items.health' },
  { path: '/salary',       category: 'LIFESTYLE',        labelKey: 'menu.items.salary' },
  { path: '/rent-vs-buy',  category: 'DECISION',         labelKey: 'menu.items.rent_vs_buy' },
  { path: '/tax-regime',   category: 'TAX EFFICIENCY',   labelKey: 'menu.items.tax_regime' },
  { path: '/insurance',    category: 'PROTECTION',       labelKey: 'menu.items.insurance' },
  { path: '/on-track',     category: 'PROGRESS CHECK',   labelKey: 'menu.items.on_track' },
];

const DESCRIPTIONS = {
  '/sip': 'How much will your monthly investment grow to? Model step-ups, inflation and tax to get a brutally honest picture.',
  '/reverse': 'Work backwards from your goal. Know exactly how much to invest today to arrive at your target tomorrow.',
  '/lumpsum': 'Deploy a one-time amount and watch compounding do its quiet, relentless work across decades.',
  '/goals': 'House, car, sabbatical — translate your life goals into a precise monthly SIP number, adjusted for inflation.',
  '/retirement': 'Design your ultimate financial freedom. We calculate the corpus and SIP required for permanent independence.',
  '/education': 'Education inflation is 10–11%. Secure academic excellence with a course-specific SIP that beats the clock.',
  '/emergency': 'How much liquidity do you really need? Calculate a buffer that lets you sleep through any financial storm.',
  '/networth': 'Total assets minus total liabilities — your financial position made crystal clear in under 2 minutes.',
  '/health': 'A multi-factor score across savings, insurance, debt and investments — benchmarked against your peers.',
  '/salary': 'Is your lifestyle sustainable on your income? Check if your spending is building wealth or eroding it.',
  '/rent-vs-buy': "India's most misunderstood financial debate — modelled with opportunity cost, rental yield and EMI math.",
  '/tax-regime': 'Which regime saves you more? A precise comparison tailored to your income, deductions and investments.',
  '/insurance': 'Your dependants deserve certainty. Calculate the exact cover that replaces your income for the right duration.',
  '/on-track': 'Compare your actual portfolio against where it should be at your age. Data from AMFI and RBI benchmarks.',
};

// ─── Tile Component ──────────────────────────────────────────────────────────

function CalculatorTile({ path, category, labelKey }) {
  const { t } = useTranslation();
  const desc = DESCRIPTIONS[path] || '';
  
  return (
    <Link
      to={path}
      className="group block rounded-2xl p-6 transition-all duration-300 border border-outline-var/10 bg-surface-low hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col h-full"
    >
      <div className="mb-4">
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary/70">
          {category}
        </span>
      </div>

      <h2 className="font-serif text-xl text-on-surface leading-snug mb-3 group-hover:text-primary transition-colors">
        {t(labelKey)}
      </h2>

      <p className="font-sans text-on-surface-var text-xs leading-relaxed opacity-60 flex-grow">
        {desc}
      </p>

      <div className="mt-6 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        Launch Calculator
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14m-7-7 7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen" style={{ paddingTop: '5.5rem' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        <p className="label-overline text-primary mb-3">HonestSIP Financial Suite</p>
        <h1 className="font-serif text-5xl md:text-7xl text-on-surface leading-[1.1] mb-6">
          Precision Engineering <br />
          <span className="italic mango-text">for your Wealth</span>
        </h1>
        <p className="font-sans text-on-surface-var text-lg max-w-2xl leading-relaxed opacity-60">
          A suite of formula-first tools designed to strip away the optimism bias and marketing math of traditional finance.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CALCULATORS.map((calc) => (
            <CalculatorTile key={calc.path} {...calc} />
          ))}

          {/* Learn Tile - styled differently to stand out but fits grid */}
          <Link
            to="/learn/what-is-a-sip"
            className="group block rounded-2xl p-6 transition-all duration-300 border border-primary/20 bg-gradient-to-br from-surface-low to-primary/5 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(var(--color-primary-rgb),0.15)] flex flex-col h-full relative overflow-hidden"
          >
            <div className="mb-4">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary">
                Masterclass
              </span>
            </div>
            <h2 className="font-serif text-xl text-on-surface leading-snug mb-3 group-hover:text-primary transition-colors">
              {t('menu.items.learn')}
            </h2>
            <p className="font-sans text-on-surface-var text-xs leading-relaxed opacity-70 flex-grow">
              No jargon. No product pitches. Just the financial concepts every Indian investor deserves to understand — explained properly.
            </p>
            <div className="mt-6 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-wider">
              Start Learning
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </div>
            {/* Subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
          </Link>
        </div>

      </div>
    </div>
  );
}
