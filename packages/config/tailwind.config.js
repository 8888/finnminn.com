/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        void: "#0d0208",
        crypt: "#1a0b14",
        bone: "#fbe9d0",
        ash: "#8a7d85",
        radical: "#ff0055",
        toxic: "#00ff41",
        spirit: "#00f2ff",
        gloom: "#4b0082",
        pip: "#58a6ff",
      },
      fontFamily: {
        pixel: ["'VT323'", "monospace"],
        mono: ["'Space Mono'", "monospace"],
      },
      boxShadow: {
        "hard-pink": "4px 4px 0px 0px #ff0055",
        "hard-green": "4px 4px 0px 0px #00ff41",
        "hard-void": "4px 4px 0px 0px #0d0208",
      },
    },
  },
  plugins: [],
};