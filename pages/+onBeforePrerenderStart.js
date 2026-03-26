import { getLearnChapters } from '../src/data/learnContent.jsx'

/**
 * Pre-render SEO-relevant URLs for all locales so deep links resolve as 200.
 */
export async function onBeforePrerenderStart() {
  const urls = new Set()
  const staticPaths = [
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
    '/learn',
  ]
  const locales = [
    { path: '/', lng: 'en' },
    { path: '/hi', lng: 'hi' },
    { path: '/mr', lng: 'mr' },
  ]

  for (const { path, lng } of locales) {
    for (const p of staticPaths) {
      if (path === '/') {
        urls.add(p)
      } else {
        urls.add(p === '/' ? path : `${path}${p}`)
      }
    }

    const chapters = getLearnChapters(lng)
    for (const ch of chapters) {
      const learnPath = path === '/' ? `/learn/${ch.id}` : `${path}/learn/${ch.id}`
      urls.add(learnPath)
    }
  }
  return Array.from(urls)
}
