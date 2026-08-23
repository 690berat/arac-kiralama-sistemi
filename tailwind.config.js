/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        asfalt: "#15171C",
        panel: "#1D2027",
        panelLight: "#262A33",
        kenar: "#33383F",
        metin: "#F1F2F4",
        metinSoft: "#9A9FA8",
        amber: "#FFB627",
        teal: "#2FD9C4",
        guven: "#5B7CFA",
        tehlike: "#FF5D5D",
      },
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        plaka: ["'Rajdhani'", "sans-serif"],
      },
      letterSpacing: {
        plaka: "0.15em",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "float 9s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
}
