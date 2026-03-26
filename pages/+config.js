import vikeReact from 'vike-react/config'

/**
 * `prerender: false` here disables the whole prerender phase — then `dist/client/`
 * has no HTML (only JS/CSS), which breaks static hosts like GitHub Pages.
 * `partial: true` runs prerender for routes that opt in (see pages/app/+config.js).
 * https://vike.dev/prerender#partial
 */
export default {
  extends: [vikeReact],
  // Global head defaults (Vike doesn't read index.html head tags at runtime).
  title: "HonestSIP — India's Smartest SIP Calculator",
  description:
    "India's most honest SIP & personal finance calculator suite. Calculate SIP returns, plan goals, check retirement readiness, and see what your corpus really buys.",
  favicon: '/favicon.png',
  prerender: { partial: true },
  // Lazy routes use Suspense; renderToString cannot resolve them — use streaming SSR.
  // https://vike.dev/stream
  stream: true,
}
