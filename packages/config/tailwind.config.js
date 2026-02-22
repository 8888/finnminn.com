/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        void: "#120B18",      // Deep Grape Charcoal
        surface: "#221528",   // Lighter potion purple
        overlay: "#2D1B36",
        vampire: "#FF5A8D",   // Lightened for contrast (from #FF2A6D)
        ectoplasm: "#05FFA1", // Spectral Mint (already high contrast)
        toxic: "#00FF41",     // Necrobloom Green
        witchcraft: "#A890FF", // Lightened for contrast (from #7D5FFF)
        gold: "#FFB800",       // Cursed Gold
        pip: "#58a6ff",        // Mascot Blue
        "text-heading": "#ffffff",
        "text-body": "#E0DCE6",
        "text-muted": "#AEA2BA", // Lightened for contrast (from #9586A5)
      },
      fontFamily: {
        header: ["'VT323'", "'Press Start 2P'", "monospace"], // Switched from cursive to monospace
        body: ["'Space Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: ({ theme }) => ({
        pixel: "4px 4px 0px 0px #000000",
        "pixel-vampire": `4px 4px 0px 0px ${theme('colors.vampire')}`,
        "pixel-ectoplasm": `4px 4px 0px 0px ${theme('colors.ectoplasm')}`,
        "pixel-witchcraft": `4px 4px 0px 0px ${theme('colors.witchcraft')}`,
      }),
    },
  },
  plugins: [],
};
