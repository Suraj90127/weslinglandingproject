// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//   extend: {

//     colors: {
//   "primary": "#f97316",        // orange-500 (kept as main brand)
//   "secondary": "#eab308",      // yellow-500 (replaces blue)
//   "accent": "#fb923c",         // orange-400 (replaces pink, softer accent)
//   "dark": "#ffffff",           // white (light theme base)
//   "darker": "#f9fafb",         // near-white / light gray background
//   "glass": "rgba(255, 255, 255, 0.7)",   // light glassmorphism
//   "card": "rgba(255, 255, 255, 0.85)",   // card background
// },
//     animation: {
//       "flip-top": "flip-top 0.3s ease-in forwards",
//     "flip-bottom": "flip-bottom 0.3s ease-out forwards",
//       "slide-up": "slideUp 20s linear infinite",
//       "slide-down": "slideDown 20s linear infinite",
//     },
//     keyframes: {
//       "flip-top": {
//       "0%": { transform: "rotateX(0deg)" },
//       "100%": { transform: "rotateX(-90deg)" },
//     },
//     "flip-bottom": {
//       "0%": { transform: "rotateX(90deg)" },
//       "100%": { transform: "rotateX(0deg)" },
//     },
//       slideUp: {
//         "0%": { transform: "translateY(0)" },
//         "100%": { transform: "translateY(-50%)" },
//       },
//       slideDown: {
//         "0%": { transform: "translateY(-50%)" },
//         "100%": { transform: "translateY(0)" },
//       },
//     },
//   },
// },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        'wrestling': ['Oswald', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'display': ['Bebas Neue', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-up': 'scaleUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'tilt': 'tilt 10s infinite linear',
        'border-flow': 'borderFlow 3s infinite linear',
        pulseFloat: "pulseFloat linear infinite",
        bgGradient: "bgGradient 20s linear infinite",
      },
      keyframes: {
        pulseFloat: {
          "0%": {
            transform: "scale(0) translateY(0) rotate(0deg)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1) translateY(-100px) rotate(360deg)",
            opacity: "0",
          },
          bgGradient: {
          "0%": { backgroundColor: "#FF9800" },   // orange
          "33%": { backgroundColor: "#FFC107" },  // yellow
          "66%": { backgroundColor: "#FFFFFF" },  // white
          "100%": { backgroundColor: "#FF9800" },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.8)' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1511097673-b21d5c935865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        'about-pattern': "url('https://images.unsplash.com/photo-1547347298-ef4d4abe0e5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        'event-pattern': "url('https://images.unsplash.com/photo-1508850138609-32eced6a82ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        'gallery-pattern': "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1905&q=80')",
        'story-pattern': "url('https://images.unsplash.com/photo-1590664864177-6a1fdba685c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        'cta-pattern': "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  }}