module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nftGray: "#16181C",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
