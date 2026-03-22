import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/** GitHub project pages need `/repo/`; user/org `*.github.io` repos use `/`. */
function normalizeBase(value) {
  if (!value || value === '/') return '/'
  const s = value.startsWith('/') ? value : `/${value}`
  return s.endsWith('/') ? s : `${s}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBase(env.VITE_BASE_PATH || process.env.VITE_BASE_PATH)
  return {
    plugins: [react()],
    base,
  }
})
