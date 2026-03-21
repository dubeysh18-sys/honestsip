/** @type {import('tailwindcss').Config} */
// trigger tailwind rebuild
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy
        surface:             'rgb(var(--color-surface) / <alpha-value>)',
        'surface-lowest':    'rgb(var(--color-surface-lowest) / <alpha-value>)',
        'surface-low':       'rgb(var(--color-surface-low) / <alpha-value>)',
        'surface-high':      'rgb(var(--color-surface-high) / <alpha-value>)',
        'surface-highest':   'rgb(var(--color-surface-highest) / <alpha-value>)',
        // Mango suite
        primary:             'rgb(var(--color-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--color-primary-container) / <alpha-value>)',
        // Accents
        secondary:           'rgb(var(--color-secondary) / <alpha-value>)', // Lavender
        tertiary:            'rgb(var(--color-tertiary) / <alpha-value>)', // Pale Sage
        // Typography
        'on-surface':        'rgb(var(--color-on-surface) / <alpha-value>)',
        'on-surface-var':    'rgb(var(--color-on-surface-var) / <alpha-value>)',
        'on-primary':        'rgb(var(--color-on-primary) / <alpha-value>)',
        // Borders
        'outline-var':       'rgb(var(--color-outline-var) / <alpha-value>)',
        // Semantic
        success:             'rgb(var(--color-success) / <alpha-value>)',
        danger:              'rgb(var(--color-danger) / <alpha-value>)',
        warning:             'rgb(var(--color-warning) / <alpha-value>)',
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
