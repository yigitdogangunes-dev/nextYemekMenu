/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        foreground: "var(--text-main)",
        primary: {
          light: "var(--primary-light)",
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
      },
      fontFamily: {
        bebas: ['var(--font-bebas)'],
        rajdhani: ['var(--font-rajdhani)'],
        fugaz: ['var(--font-fugaz)'],
      },
      boxShadow: {
        'apple': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 12px 40px rgba(0, 0, 0, 0.08)',
        'glass': '0 4px 20px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
};
