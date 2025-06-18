/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        blackhan: ['"Black Han Sans"', 'sans-serif'],
        cabin: ['Cabin', 'sans-serif'],
        bungee: ['Bungee', 'cursive'],
        marker: ['"Permanent Marker"', 'cursive'],
      },
    },
  },
  plugins: [],
}

