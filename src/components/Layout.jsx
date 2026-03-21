import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import compassLogo from '../assets/compass.png';

const NAV_ITEMS = [
  { path: '/', icon: '📊', labelKey: 'menu.mobile.sip' },
  { path: '/goals', icon: '🏁', labelKey: 'menu.mobile.goals' },
  { path: '/on-track', icon: '✅', labelKey: 'menu.mobile.track' },
  { path: '/learn', icon: '📚', labelKey: 'menu.mobile.learn' },
];

const MENU_ITEMS = [
  { path: '/',          labelKey: 'menu.items.forward' },
  { path: '/reverse',  labelKey: 'menu.items.reverse' },
  { path: '/goals',    labelKey: 'menu.items.goals' },
  { path: '/retirement', labelKey: 'menu.items.retirement' },
  { path: '/education', labelKey: 'menu.items.education' },
  { path: '/emergency', labelKey: 'menu.items.emergency' },
  { path: '/networth',  labelKey: 'menu.items.networth' },
  { path: '/health',    labelKey: 'menu.items.health' },
  { path: '/salary',    labelKey: 'menu.items.salary' },
  { path: '/rent-vs-buy', labelKey: 'menu.items.rent_vs_buy' },
  { path: '/tax-regime', labelKey: 'menu.items.tax_regime' },
  { path: '/insurance', labelKey: 'menu.items.insurance' },
  { path: '/on-track',  labelKey: 'menu.items.on_track' },
  { path: '/learn',     labelKey: 'menu.items.learn' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.lang = i18n.language.split('-')[0];
  }, [i18n.language]);

  React.useEffect(() => {
    // Hydrate the theme globally on initial load to prevent 'flash of dark mode' 
    // since ThemeToggle is unmounted until menu opens.
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="min-h-screen text-on-surface transition-colors duration-300" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
      {/* Top Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 backdrop-blur-md transition-colors duration-300"
        style={{ backgroundColor: 'rgba(var(--color-surface), 0.95)' }}
      >
        <Link to="/" className="flex items-center" aria-label="Home">
          <div className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-on-surface">
            <img 
              src={compassLogo} 
              alt="Compass Logo" 
              className="w-24 h-24 object-contain -ml-8 -mr-6 scale-[1.4]" 
            />
            <span>Honest<span className="text-secondary opacity-80" style={{ color: 'rgb(var(--color-primary))', opacity: 1 }}>SIP</span></span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col justify-center gap-1.5"
            aria-label="Menu"
          >
            <span className={`block h-px bg-on-surface transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px bg-on-surface transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-on-surface transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Slide-out menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMenuOpen(false)}
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <nav
            className="absolute top-0 right-0 h-full w-72 overflow-y-auto py-20 px-6 border-l border-outline-var/10 shadow-2xl"
            style={{ background: 'rgb(var(--color-surface-low))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 pb-6 border-b border-outline-var/15">
              <p className="label-overline text-on-surface-var mb-3">Language / भाषा</p>
              <select
                className="select-ghost"
                value={i18n.language.split('-')[0]}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <p className="label-overline text-on-surface-var mb-6">{t('menu.calculators')}</p>
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
                {t(item.labelKey)}
              </Link>
            ))}

            <div className="mt-6 pt-6 flex items-center justify-between border-t border-outline-var/15">
              <span className="text-on-surface-var font-sans text-sm">Appearance</span>
              <ThemeToggle />
            </div>

            <div className="mt-8 pt-6 border-t border-outline-var/15">
              <p className="text-xs text-on-surface-var opacity-50 leading-relaxed">
                {t('menu.disclaimer')}
              </p>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="pt-14">
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
                <span className="text-xs font-sans font-medium">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop disclaimer */}
      <footer className="hidden md:block text-center py-8 px-6 text-xs text-on-surface-var opacity-30 max-w-4xl mx-auto">
        {t('menu.footer')}
      </footer>
    </div>
  );
}
