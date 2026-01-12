import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta basada en tu invitación
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2d4a6f',
          dark: '#152a4a',
        },
        gold: {
          DEFAULT: '#c9a962',
          light: '#d4bc82',
          dark: '#b8944d',
        },
        floral: {
          DEFAULT: '#6b8fc5',
          light: '#a8c0d0',
          muted: '#8faabe',
        },
        cream: {
          DEFAULT: '#fdfcfa',
          dark: '#f5f4ef',
        },
        charcoal: {
          DEFAULT: '#2c3e50',
          light: '#3d4f61',
        },
      },
      fontFamily: {
        script: ['var(--font-great-vibes)', 'cursive'],
        heading: ['var(--font-sacramento)', 'cursive'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(30, 58, 95, 0.08)',
        'elegant': '0 8px 30px rgba(30, 58, 95, 0.12)',
        'glow': '0 0 40px rgba(107, 143, 197, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;