import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        hand: ['Caveat', 'cursive'],
        marker: ['Gochi Hand', 'cursive'],
        pen: ['Nanum Pen Script', 'cursive'],
      },
      colors: {
        paper: '#FDFCF8',
        surface: '#FFFFFF',
        ink: '#111111',
        subtle: '#666666',
        line: '#E5E5E5',
        border: '#111111',
        accent: '#FF4F00',
        'level-0': '#F3F4F6',
        'level-1': '#FEF3C7',
        'level-2': '#FFDBC1',
        'level-3': '#D1FAE5',
      },
      boxShadow: {
        hard: '4px 4px 0px 0px #111111',
        'hard-sm': '2px 2px 0px 0px #111111',
        'hard-xl': '8px 8px 0px 0px #111111',
        paper: '1px 1px 4px rgba(0,0,0,0.1), 2px 8px 12px rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(#CECECE 1px, transparent 1px)',
        'lined-paper': 'repeating-linear-gradient(transparent, transparent 27px, #94a3b8 28px)',
        'graph-paper':
          'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)',
        'diagonal-stripes':
          'repeating-linear-gradient(45deg, #FEF3C7, #FEF3C7 10px, #FDE68A 10px, #FDE68A 20px)',
        'hazard-stripes':
          'repeating-linear-gradient(45deg, #111, #111 10px, #FF4F00 10px, #FF4F00 20px)',
        'marker-highlight':
          'linear-gradient(120deg, rgba(255,255,0,0.2) 0%, rgba(255,255,0,0.6) 100%)',
        carbon: 'radial-gradient(circle, #222 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 12s linear infinite',
        marquee: 'marquee 25s linear infinite',
        'shuffle-out': 'shuffleOut 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shuffle-in': 'shuffleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        blink: 'blink 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        shuffleOut: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '50%': { transform: 'translateX(120%) rotate(10deg)' },
          '100%': { transform: 'translateX(0) rotate(-5deg) scale(0.95)', zIndex: '0' },
        },
        shuffleIn: {
          '0%': { transform: 'scale(0.95) rotate(-5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}

export default config
