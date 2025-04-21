/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#215E45',
          dark: '#0B3D2D',
        },
        secondary: '#121212',
        accent: '#FFD700',
        content: '#C5E8D5',
      },
    },
  },
  plugins: [],
}; 