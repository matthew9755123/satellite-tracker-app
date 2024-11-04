/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  safelist: [
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({addUtilities}){
      const newUtilites = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };
      addUtilities(newUtilites);
    },
  ],
}

