/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - empowering, not "pink-washed"
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee7',  // Main primary
          600: '#0070c4',
          700: '#0159a0',
          800: '#064c84',
          900: '#0b406e',
        },
        // Secondary - warm, energetic
        secondary: {
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#ffcdc9',
          300: '#fda4a0',
          400: '#f97066',
          500: '#f04438',  // Main secondary
          600: '#de3024',
          700: '#ba241a',
          800: '#9a221a',
          900: '#80231c',
        },
        // Neutral grays
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Cycle phase colors (for 20-40 demographic)
        cycle: {
          menstrual: '#ef4444',   // Red
          follicular: '#22c55e', // Green
          ovulatory: '#f59e0b',  // Amber
          luteal: '#8b5cf6',     // Purple
        },
        // Success/Error states
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
