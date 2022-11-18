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
      },
      colors: {
        black: {
          DEFAULT: '#051425',
          light: '#747373'
        },
        blue: {
          DEFAULT: '#1B66FF',
          light: '#03B3FF',
          dark: '#0B58AF',
          ocean: '#03B3FF'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
}
