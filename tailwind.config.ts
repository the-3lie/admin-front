import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F6F0',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#16243D',
          soft: '#3C4A63',
          faint: '#7C879C',
        },
        line: '#DADFD6',
        gold: {
          DEFAULT: '#B8863B',
          soft: '#E4CB9A',
          deep: '#8C6425',
        },
        present: {
          DEFAULT: '#2F6F4E',
          bg: '#E4EFE7',
        },
        late: {
          DEFAULT: '#B0791E',
          bg: '#F5E9D3',
        },
        absent: {
          DEFAULT: '#AE3A34',
          bg: '#F3E1DF',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        lg: '10px',
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
} satisfies Config;
