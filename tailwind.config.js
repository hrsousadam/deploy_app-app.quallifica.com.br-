/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0f172a", // Cor de fundo escura
        "accent-blue": "#0ea5e9", // Azul ciano de destaque
        "accent-green": "#10b981", // Verde neon
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Fonte limpa e moderna
      },
    },
  },
  plugins: [],
};
