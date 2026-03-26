/** Canonical site origin for OG URLs, hreflang, and JSON-LD (override via .env). */
const viteSiteUrl = import.meta.env.VITE_SITE_URL;
export const SITE_ORIGIN =
  (viteSiteUrl && String(viteSiteUrl).replace(/\/$/, '')) || 'https://honestsip.in';

export function absoluteUrl(pathname) {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN.replace(/\/$/, '')}${p}`;
}
