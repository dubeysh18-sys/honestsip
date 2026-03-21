/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        surface:             '#131313',
        'surface-lowest':    '#0e0e0e',
        'surface-low':       '#1c1b1b',
        'surface-high':      '#2a2a2a',
        'surface-highest':   '#353534',
        // Mango suite
        primary:             '#ffb77d',
        'primary-container': '#ff8c00',
        // Accents
        secondary:           '#cebefa', // Lavender
        tertiary:            '#bdcca3', // Pale Sage
        // Typography
        'on-surface':        '#e5e2e1',
        'on-surface-var':    '#ddc1ae',
        'on-primary':        '#1a0a00',
        // Borders
        'outline-var':       '#564334',
        // Semantic
        success:             '#4caf82',
        danger:              '#e05252',
        warning:             '#f5c842',
      },
      fontFamily: {
        serif:  ['Newsreader', 'Georgia', 'serif'],
        sans:   ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.8rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline-lg': ['2rem',  { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'headline-md': ['1.5rem',{ lineHeight: '1.25' }],
        'title-lg':    ['1.25rem',{ lineHeight: '1.35' }],
        'body-lg':     ['1rem',  { lineHeight: '1.6' }],
        'body-md':     ['0.875rem', { lineHeight: '1.6' }],
        'label-lg':    ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label-md':    ['0.75rem',  { lineHeight: '1.4', letterSpacing: '0.08em' }],
        'label-sm':    ['0.6875rem',{ lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xl2': '1rem',
        'full': '9999px',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'mango': '0 0 40px 0 rgba(255,183,125,0.06)',
        'glass': 'inset 0 1px 0 rgba(229,226,225,0.1), 0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
