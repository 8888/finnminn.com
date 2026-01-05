const sharedConfig = require("@finnminn/config/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Ensure we scan the UI package for classes
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}" 
  ],
};