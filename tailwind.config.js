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
        primary: "rgb(255, 0, 234)", 
        secondary: "#1E90FF", 
        accent: "hsl(210, 50%, 60%)", 
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
  ],
};
