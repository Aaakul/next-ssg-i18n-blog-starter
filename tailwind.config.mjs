/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
}
export default config
