/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "dark",
      "light",
      "cupcake",
      "cyberpunk",
      "dracula",
      "aqua",
      "luxury",
    ],
  },
};
