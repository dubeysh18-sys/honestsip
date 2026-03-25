import vikeReact from 'vike-react/config'

/** Default: no prerender (CSR). Opt-in under pages/app/+config.js */
export default {
  extends: [vikeReact],
  prerender: false,
  // Lazy routes use Suspense; renderToString cannot resolve them — use streaming SSR.
  // https://vike.dev/stream
  stream: true,
}
