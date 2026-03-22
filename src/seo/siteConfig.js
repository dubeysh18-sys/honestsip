/** Canonical site origin for OG URLs, hreflang, and JSON-LD (override via .env). */
export const SITE_ORIGIN =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://honestsip.in';

export function absoluteUrl(pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN.replace(/\/$/, '')}${p}`;
}
