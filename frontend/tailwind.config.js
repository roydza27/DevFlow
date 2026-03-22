/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-bright": "#31394d",
        "surface-container-high": "#222a3d",
        "surface": "#0b1326",
        "surface-dim": "#0b1326",
        "on-secondary-container": "#aeb9d0",
        "surface-variant": "#2d3449",
        "error": "#ffb4ab",
        "surface-container": "#171f33",
        "secondary": "#bcc7de",
        "on-secondary": "#263143",
        "on-surface-variant": "#c7c4d8",
        "surface-container-highest": "#2d3449",
        "tertiary": "#4edea3",
        "on-tertiary": "#003824",
        "tertiary-container": "#006e4b",
        "on-tertiary-container": "#67f4b7",
        "on-primary-container": "#d9d8ff",
        "primary": "#c0c1ff",
        "outline": "#918fa1",
        "secondary-container": "#3e495d",
        "on-primary": "#1000a9",
        "primary-container": "#4b4dd8",
        "on-surface": "#dae2fd",
        "background": "#0b1326",
        "outline-variant": "#464555"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
