/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ← this is critical
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: { extend: {} },
  plugins: [],
}
