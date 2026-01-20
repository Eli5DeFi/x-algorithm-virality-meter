/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Terminal theme colors
        'term-green': '#00ff41',
        'term-green-dim': '#00aa2a',
        'term-amber': '#ffb000',
        'term-red': '#ff3333',
        'term-cyan': '#00d4ff',
        'term-bg': '#0a0a0a',
        'term-bg-light': '#111111',
        'term-border': '#1a1a1a',
        'term-gray': '#666666',
        // Legacy X colors
        'x-blue': '#1d9bf0',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
