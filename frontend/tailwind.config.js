/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#141414',
          light: '#e50914', // Netflix red
          gray: '#808080',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0) 100%)',
      }
    },
  },
  plugins: [],
}
