import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import compassLogo from '../assets/compass.png';
import SeoController from '../seo/SeoController';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import { stripLocalePath, toLocalizedPath } from '../seo/localePaths';


const MENU_ITEMS = [
  { path: '/sip',       labelKey: 'menu.items.forward' },
  { path: '/reverse',   labelKey: 'menu.items.reverse' },
  { path: '/lumpsum',   labelKey: 'menu.items.lumpsum' },
  { path: '/goals',     labelKey: 'menu.items.goals' },
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

const HEADER_BLUR_SCROLL_PX = 12;

function menuItemActive(pathname, itemPath) {
  const s = stripLocalePath(pathname);
  if (itemPath === '/learn') return s.startsWith('/learn');
  if (s === itemPath) return true;
  if (itemPath !== '/' && s.startsWith(`${itemPath}/`)) return true;
  return false;
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const lp = useLocalizedPath();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuBtnDock, setMenuBtnDock] = React.useState(null);
  const menuBtnWrapRef = React.useRef(null);
  const [headerScrolled, setHeaderScrolled] = React.useState(false);
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  React.useEffect(() => {
    const onScroll = () => {
      setHeaderScrolled(window.scrollY > HEADER_BLUR_SCROLL_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = i18n.language.split('-')[0];
  }, [i18n.language]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const closeMenu = () => {
    setMenuBtnDock(null);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
      return;
    }
    const el = menuBtnWrapRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setMenuBtnDock({
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      });
    }
    setMenuOpen(true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    closeMenu();
  };

  return (
    <div className="min-h-screen text-on-surface transition-colors duration-300" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
      <SeoController />
      {/* Top Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 pt-4 transition-all duration-300 ${
          headerScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'
        }`}
        style={{ backgroundColor: 'rgba(var(--color-surface), 0.95)' }}
      >
        <Link to={lp('/')} className="flex items-center" aria-label="Home">
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
          {menuOpen ? (
            <span className="h-8 w-8 shrink-0" aria-hidden />
          ) : (
            <div ref={menuBtnWrapRef} className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleMenu}
                className="flex h-8 w-8 flex-col justify-center gap-1.5"
                aria-label="Menu"
                aria-expanded={false}
              >
                <span className="block h-px bg-on-surface transition-all duration-300" />
                <span className="block h-px bg-on-surface transition-all duration-300" />
                <span className="block h-px bg-on-surface transition-all duration-300" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Slide-out menu */}
      {menuOpen && (
        <>
        <div
          className="fixed inset-0 z-[55]"
          onClick={closeMenu}
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <nav
            className="absolute top-0 right-0 h-full max-w-[85vw] w-64 sm:w-72 md:w-80 overflow-y-auto pt-36 pb-8 px-5 border-l border-outline-var/10 shadow-2xl pointer-events-auto"
            style={{ background: 'rgb(var(--color-surface-low))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 pb-6 border-b border-outline-var/15">
              <p className="label-overline text-on-surface-var mb-3">Language / भाषा</p>
              <select
                className="select-ghost"
                value={i18n.language.split('-')[0]}
                onChange={(e) => {
                  const lng = e.target.value;
                  i18n.changeLanguage(lng);
                  navigate(toLocalizedPath(stripLocalePath(location.pathname), lng));
                }}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="flex-1 h-px opacity-10" style={{ background: 'rgb(var(--color-on-surface))' }} />
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-on-surface-var opacity-40 select-none">
                {t('menu.calculators')}
              </p>
              <span className="flex-1 h-px opacity-10" style={{ background: 'rgb(var(--color-on-surface))' }} />
            </div>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path === '/learn' ? lp('/learn/what-is-a-sip') : lp(item.path)}
                onClick={closeMenu}
                className={`block py-3 font-sans text-sm transition-colors ${
                  menuItemActive(location.pathname, item.path)
                    ? 'mango-text font-semibold'
                    : 'text-on-surface-var hover:text-on-surface'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}

            <div className="mt-6 pt-6 flex items-center justify-between border-t border-outline-var/15">
              <span className="text-on-surface-var font-sans text-sm">Appearance</span>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>

            <div className="mt-8 pt-6 border-t border-outline-var/15">
              <p className="text-xs text-on-surface-var opacity-50 leading-relaxed">
                {t('menu.disclaimer')}
              </p>
            </div>
          </nav>
        </div>
        {menuBtnDock && (
          <div
            className="pointer-events-auto fixed z-[60] flex items-center justify-center"
            style={{
              top: menuBtnDock.top,
              left: menuBtnDock.left,
              width: menuBtnDock.width,
              height: menuBtnDock.height,
            }}
          >
            <button
              type="button"
              onClick={toggleMenu}
              className={`flex h-8 w-8 flex-col justify-center gap-1.5 rounded-md shadow-sm ring-1 ring-outline-var/20 transition-all duration-300 dark:ring-white/10 ${
                headerScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'
              }`}
              style={{ backgroundColor: 'rgba(var(--color-surface), 0.95)' }}
              aria-label="Close menu"
              aria-expanded={true}
            >
              <span className="block h-px bg-on-surface transition-all duration-300 rotate-45 translate-y-2" />
              <span className="block h-px bg-on-surface transition-all duration-300 opacity-0" />
              <span className="block h-px bg-on-surface transition-all duration-300 -rotate-45 -translate-y-2" />
            </button>
          </div>
        )}
        </>
      )}

      {/* Main content */}
      <main className="pt-32">
        <Outlet />
      </main>

      {/* Desktop disclaimer */}
      <footer className="hidden md:block text-center py-8 px-6 text-xs text-on-surface-var opacity-30 max-w-4xl mx-auto">
        {t('menu.footer')}
      </footer>
    </div>
  );
}
