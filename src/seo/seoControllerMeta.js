import { absoluteUrl } from './siteConfig';
import { stripLocalePath, toLocalizedPath } from './localePaths';

/** Route-specific SEO (logical paths, no /hi /mr prefix). */
const PAGE_META = {
  '/': {
    title: {
      en: "HonestSIP — India's Smartest SIP Calculator",
      hi: 'एसआईपी कैलकुलेटर (SIP Calculator Hindi)',
      mr: 'एसआयपी कॅल्क्युलेटर (SIP Calculator Marathi)',
    },
    description:
      "India's most honest SIP & personal finance calculator suite. Calculate SIP returns, plan goals, check retirement readiness, and see what your corpus really buys.",
  },
  '/sip': {
    title: {
      en: 'SIP Calculator',
      hi: 'एसआईपी कैलकुलेटर (SIP Calculator Hindi)',
      mr: 'एसआयपी कॅल्क्युलेटर (SIP Calculator Marathi)',
    },
    description:
      'Calculates Maturity SIP Value after Tax (Budget 2024 LTCG), Inflation & TER.',
  },
  '/retirement': {
    title: {
      en: 'Retirement Planner — HonestSIP',
      hi: 'रिटायरमेंट प्लानर — HonestSIP',
      mr: 'निवृत्तीवेतन नियोजन — HonestSIP',
    },
    description:
      'Calculate SIP maturity with EPF and EEE status for salaried class.',
  },
};

const LEARN_META = {
  title: {
    en: 'Honest Masterclass — HonestSIP',
    hi: 'Honest Masterclass — HonestSIP',
    mr: 'Honest Masterclass — HonestSIP',
  },
  description:
    'Plain-English personal finance concepts for Indian investors. Educational content only — not financial advice.',
};

const DEFAULT_META = {
  title: { en: 'HonestSIP', hi: 'HonestSIP', mr: 'HonestSIP' },
  description:
    "India's most honest SIP & personal finance calculator suite. Educational tools only — not financial advice.",
};

export function getPageMeta(logicalPath, lang) {
  if (logicalPath.startsWith('/learn')) {
    const lng = lang === 'hi' || lang === 'mr' ? lang : 'en';
    return {
      title: LEARN_META.title[lng] || LEARN_META.title.en,
      description: LEARN_META.description,
    };
  }
  const key = logicalPath === '' ? '/' : logicalPath;
  const entry = PAGE_META[key] || {};
  const titles = { ...DEFAULT_META.title, ...entry.title };
  const lng = lang === 'hi' || lang === 'mr' ? lang : 'en';
  return {
    title: titles[lng] || titles.en,
    description: entry.description || DEFAULT_META.description,
  };
}

export function buildHreflangLinks(pathname) {
  const logical = stripLocalePath(pathname);
  const paths = ['en', 'hi', 'mr'].map((lng) => ({
    hrefLang: lng === 'en' ? 'en-IN' : lng === 'hi' ? 'hi-IN' : 'mr-IN',
    href: absoluteUrl(toLocalizedPath(logical, lng === 'en' ? 'en' : lng)),
  }));
  paths.push({
    hrefLang: 'x-default',
    href: absoluteUrl(toLocalizedPath(logical, 'en')),
  });
  return paths;
}
