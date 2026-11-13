import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F6F2',
        ink: '#151A19',
        accent: '#F04A28',
        'accent-dark': '#B83417',
        sky: '#D8E8EE',
        'sky-2': '#EAF3F6',
        muted: '#6C716D',
        line: '#DAD8CF',
        'line-dark': '#2C332E',
        // Legacy aliases kept while components are migrated.
        paper: '#F7F6F2',
        'paper-2': '#ECEAE2',
        'ink-soft': '#3B423D',
        clay: '#F04A28',
        'clay-dark': '#B83417',
        'clay-soft': '#FFE2DA',
        moss: '#1F4A3E',
        'moss-soft': '#E1EEE8',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        label: '0.16em',
      },
      maxWidth: {
        page: '1400px',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        wipe: {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        rise: 'rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both',
        fade: 'fade 0.5s ease-out both',
        wipe: 'wipe 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config
