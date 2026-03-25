import i18n from '../src/i18n.js'

function lngFromPathname(pathname) {
  if (pathname === '/mr' || pathname.startsWith('/mr/')) return 'mr'
  if (pathname === '/hi' || pathname.startsWith('/hi/')) return 'hi'
  return 'en'
}

export async function onBeforeRender(pageContext) {
  const base = pageContext.urlOriginal || '/'
  const pathname = new URL(base, 'http://localhost').pathname
  await i18n.changeLanguage(lngFromPathname(pathname))
  return {}
}
