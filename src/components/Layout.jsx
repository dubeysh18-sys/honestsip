import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: '📊', label: 'SIP' },
  { path: '/reverse', icon: '🎯', label: 'Reverse' },
  { path: '/goals', icon: '🏁', label: 'Goals' },
  { path: '/on-track', icon: '✅', label: 'Track' },
];

const MENU_ITEMS = [
  { path: '/',          label: 'Forward SIP Calculator' },
  { path: '/reverse',  label: 'Reverse SIP Calculator' },
  { path: '/goals',    label: 'Goal Planner' },
  { path: '/retirement', label: 'Retirement Planner' },
  { path: '/education', label: "Child's Education Fund" },
  { path: '/emergency', label: 'Emergency Fund' },
  { path: '/networth',  label: 'Net Worth Snapshot' },
  { path: '/health',    label: 'Financial Health Score' },
  { path: '/salary',    label: 'Salary-Lifestyle Alignment' },
  { path: '/rent-vs-buy', label: 'Rent vs Buy' },
  { path: '/tax-regime', label: 'Old vs New Tax Regime' },
  { path: '/insurance', label: 'Term Insurance Calculator' },
  { path: '/on-track',  label: 'Am I On Track?' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen" style={{ background: '#131313' }}>
      {/* Top Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4"
        style={{ background: 'rgba(19,19,19,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xs label-overline text-on-surface-var tracking-widest">THE</span>
          <span className="font-serif text-lg text-on-surface">Archivist</span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex flex-col justify-center gap-1.5"
          aria-label="Menu"
        >
          <span className={`block h-px bg-on-surface transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-px bg-on-surface transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px bg-on-surface transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Slide-out menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMenuOpen(false)}
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <nav
            className="absolute top-0 right-0 h-full w-72 overflow-y-auto py-20 px-6"
            style={{ background: '#1c1b1b' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="label-overline text-on-surface-var mb-6">Calculators</p>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block py-3 font-sans text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'mango-text font-semibold'
                    : 'text-on-surface-var hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(86,67,52,0.15)' }}>
              <p className="text-xs text-on-surface-var opacity-50 leading-relaxed">
                HonestSIP calculators are for educational purposes only. Not financial advice.
                Tax calculations based on Budget 2024 rates.
              </p>
            </div>
          </nav>
        </div>
      )}

      {/* Ticker tape */}
      <div
        className="fixed top-14 left-0 right-0 z-30 overflow-hidden py-1.5"
        style={{ background: '#0e0e0e', borderBottom: '1px solid rgba(86,67,52,0.10)' }}
      >
        <div className="ticker-content flex gap-12 whitespace-nowrap" style={{ display: 'flex' }}>
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <span className="label-md uppercase tracking-widest text-on-surface-var opacity-50 text-xs">
                SENSEX 20Y CAGR ≈ 14%&nbsp;&nbsp;•&nbsp;&nbsp;
                EQUITY LTCG: 12.5% (Budget 2024)&nbsp;&nbsp;•&nbsp;&nbsp;
                AMFI SIP AVG: ₹2,350/mo&nbsp;&nbsp;•&nbsp;&nbsp;
                EPFO RATE: 8.25% FY24&nbsp;&nbsp;•&nbsp;&nbsp;
                RBI TARGET INFLATION: 4%&nbsp;&nbsp;•&nbsp;&nbsp;
                EDUCATION INFLATION: 10–11% EY-CII 2023&nbsp;&nbsp;•&nbsp;&nbsp;
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="pt-24">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav md:hidden">
        <div className="flex">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                  active ? 'mango-text' : 'text-on-surface-var opacity-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-sans font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop disclaimer */}
      <footer className="hidden md:block text-center py-8 px-6 text-xs text-on-surface-var opacity-30 max-w-4xl mx-auto">
        HonestSIP calculators are for educational and planning purposes only. They do not constitute financial advice.
        Mutual fund investments are subject to market risks. Tax calculations effective July 23, 2024 (Budget 2024).
        Peer benchmarking based on RBI, AMFI, WID India, PLFS data.
      </footer>
    </div>
  );
}
