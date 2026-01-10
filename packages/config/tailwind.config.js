/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        void: "#050510",
        surface: "#1a1a2e",
        overlay: "#16213e",
        vampire: "#ff0055", // Primary
        ectoplasm: "#00ff41", // Secondary
        witchcraft: "#9d46ff", // Accent
        "text-heading": "#ffffff",
        "text-body": "#e0e0e0",
        "text-muted": "#9494a8",
      },
      fontFamily: {
        header: ["'VT323'", "'Press Start 2P'", "cursive"],
        body: ["'Space Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        pixel: "4px 4px 0px 0px #000000",
        "pixel-vampire": "4px 4px 0px 0px #ff0055",
        "pixel-ectoplasm": "4px 4px 0px 0px #00ff41",
        "pixel-witchcraft": "4px 4px 0px 0px #9d46ff",
      },
    },
  },
  plugins: [],
};