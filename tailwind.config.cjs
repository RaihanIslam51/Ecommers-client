/**
 * Tailwind configuration — extends the color palette with the project's
 * professional global color palette so you can use `bg-primary`, `text-primary-600`, etc.
 */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './app/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Bright Indigo Blue
          600: '#1E40AF',     // Darker variant for hover/focus
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald Green
          600: '#059669',     // Hover variant
        },
      },
    },
  },
  plugins: [],
};
