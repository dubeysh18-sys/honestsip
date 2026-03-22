#!/usr/bin/env node
/**
 * Writes public/sitemap.xml listing en, hi, and mr URLs for static hosting.
 * Run: node scripts/generate-sitemap.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const ORIGIN = (process.env.VITE_SITE_URL || 'https://honestsip.in').replace(/\/$/, '');

const LOGICAL_PATHS = [
  '/',
  '/sip',
  '/reverse',
  '/lumpsum',
  '/goals',
  '/retirement',
  '/education',
  '/emergency',
  '/networth',
  '/health',
  '/salary',
  '/rent-vs-buy',
  '/tax-regime',
  '/insurance',
  '/on-track',
  '/learn/what-is-a-sip',
];

const LANGS = ['en', 'hi', 'mr'];

function localized(logical, lang) {
  if (lang === 'en') return logical === '/' ? '/' : logical;
  return logical === '/' ? `/${lang}` : `/${lang}${logical}`;
}

function url(loc) {
  return `${ORIGIN}${loc === '/' ? '' : loc}`;
}

const urls = [];
for (const logical of LOGICAL_PATHS) {
  for (const lang of LANGS) {
    urls.push(url(localized(logical, lang)));
  }
}

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${loc.endsWith('/sip') || loc.endsWith('/hi/sip') || loc.endsWith('/mr/sip') ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'sitemap.xml'), body, 'utf8');
console.log('Wrote public/sitemap.xml with', urls.length, 'URLs');
