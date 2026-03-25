import { getLearnChapters } from '../src/data/learnContent.jsx'

/**
 * URLs pre-rendered with real HTML (home + learn) for SEO.
 * Calculator routes stay CSR; GitHub Pages serves them via 404.html SPA fallback.
 */
export async function onBeforePrerenderStart() {
  const urls = []
  const locales = [
    { path: '/', lng: 'en' },
    { path: '/hi', lng: 'hi' },
    { path: '/mr', lng: 'mr' },
  ]
  for (const { path, lng } of locales) {
    urls.push(path)
    const chapters = getLearnChapters(lng)
    for (const ch of chapters) {
      const learnPath = path === '/' ? `/learn/${ch.id}` : `${path}/learn/${ch.id}`
      urls.push(learnPath)
    }
  }
  return urls
}
