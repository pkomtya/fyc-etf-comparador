/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#ffde59",
          black: "#1a1a1a",
          cream: "#f5f2ec",
          goodBg: "#eaf5ea",
          goodFg: "#1a6e1a",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
