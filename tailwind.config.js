/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
        heading: ['var(--font-calsans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0070f3',
        secondary: '#6b21a8',
        accent: '#f59e0b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      blur: {
        '4xl': '128px',
        '5xl': '256px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'meteor': 'meteor 5s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'text-gradient': 'text-gradient 1.5s linear infinite',
        'background-shine': 'background-shine 2s linear infinite',
        'border-beam': 'border-beam 2s linear infinite',
      },
      keyframes: {
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: 0 },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'text-gradient': {
          to: {
            backgroundPosition: '200% center',
          },
        },
        'background-shine': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'border-beam': {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, #f59e0b20, #3b82f620, #0070f320, #6b21a820, #f59e0b20)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px 5px rgba(0, 112, 243, 0.35)',
        'glow-secondary': '0 0 20px 5px rgba(107, 33, 168, 0.35)',
        'glow-accent': '0 0 20px 5px rgba(245, 158, 11, 0.35)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      transitionTimingFunction: {
        'bounce-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderWidth: {
        '1': '1px',
      },
      gridTemplateColumns: {
        'auto-fill-100': 'repeat(auto-fill, minmax(100px, 1fr))',
        'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.primary'),
              },
            },
            'h1, h2, h3, h4': {
              fontWeight: theme('fontWeight.bold'),
              fontFamily: theme('fontFamily.heading'),
            },
            code: {
              fontFamily: theme('fontFamily.mono'),
              backgroundColor: theme('colors.gray.100'),
              padding: theme('spacing.1'),
              borderRadius: theme('borderRadius.md'),
            },
            'pre, code': {
              fontFamily: theme('fontFamily.mono'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary'),
              '&:hover': {
                color: theme('colors.primary'),
              },
            },
            heading: {
              color: theme('colors.white'),
            },
            strong: {
              color: theme('colors.white'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-size': '200% auto',
          'background-position': '0% center',
        },
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 15px 30px rgba(0, 0, 0, 0.11), 0 5px 15px rgba(0, 0, 0, 0.08)',
        },
        '.text-shadow-none': {
          'text-shadow': 'none',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.perspective-2000': {
          'perspective': '2000px',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.animate-gradient-x': {
          'background-size': '200% 200%',
          'animation': 'gradient 8s linear infinite',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}; 