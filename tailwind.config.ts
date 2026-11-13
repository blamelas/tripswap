import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F2E9',
        'paper-2': '#EFE8DA',
        ink: '#151310',
        'ink-soft': '#4A443B',
        muted: '#7C7365',
        line: '#DCD2C1',
        clay: '#AC4620',
        'clay-dark': '#8C3818',
        'clay-soft': '#F1DED3',
        moss: '#3E4A3A',
        'moss-soft': '#E4E8DE',
      },
      fontFamily: {
        sans: ['"Inter Tight Variable"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        page: '1280px',
      },
      boxShadow: {
        lift: '0 18px 50px -24px rgba(21, 19, 16, 0.35)',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        fade: 'fade 0.5s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config
