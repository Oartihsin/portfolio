/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#2563eb',
        'accent-dark': '#1d4ed8',
        surface: '#f9fafb',
        border: '#e5e7eb',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}
