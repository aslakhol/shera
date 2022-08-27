module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
  daisyui: {
    themes: ["winter", "night", "cmyk"],
  },
};
