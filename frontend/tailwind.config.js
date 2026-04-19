export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#6941C6', // Untitled UI Primary
          foreground: '#FFFFFF',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        error: {
          DEFAULT: '#D92D20',
        },
        success: {
          DEFAULT: '#12B76A',
        },
        warning: {
          DEFAULT: '#F79009',
        },
        info: {
          DEFAULT: '#1570EF',
        },
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [],
};
