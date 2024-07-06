/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          '600': '#dd6b20', // existing color
          '700': '#c05621', // darker shade
        },
        indigo: {
          '600': '#5a67d8', // existing color
          '700': '#4c51bf', // darker shade
        },
      },
    },
  },
  plugins: [],
}
