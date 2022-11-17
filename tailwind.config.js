/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '500px',
      md: '769px',
      lg: '1025px',
      xl: '1281px',
      '2xl': '1536px'
    },
    extend: {
      scale: {
        101: '1.01',
        102: '1.02'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
}
