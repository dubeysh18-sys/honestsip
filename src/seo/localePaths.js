/** Strip /hi or /mr prefix from pathname. */
export function stripLocalePath(pathname) {
  if (!pathname) return '/';
  if (pathname.startsWith('/hi/')) return pathname.slice(3) || '/';
  if (pathname === '/hi') return '/';
  if (pathname.startsWith('/mr/')) return pathname.slice(3) || '/';
  if (pathname === '/mr') return '/';
  return pathname;
}

/** Logical path like /sip -> localized URL for lng (en | hi | mr). */
export function toLocalizedPath(logicalPath, lng) {
  const p = logicalPath === '' || logicalPath === '/' ? '/' : logicalPath.startsWith('/') ? logicalPath : `/${logicalPath}`;
  if (lng === 'hi' || lng === 'mr') {
    return p === '/' ? `/${lng}` : `/${lng}${p}`;
  }
  return p === '/' ? '/' : p;
}
