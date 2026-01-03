# Apply Cryptid Console Design System

## Overview
This feature updates the private application section (`src/public/app/index.html`) to align with the site-wide "Cryptid Console" design system. It replaces the generic Bootstrap styling with custom Tailwind CSS utility classes, adhering to the 8-bit, retro-tech aesthetic.

## Goals
1.  **Visual Consistency:** Ensure the private dashboard looks like the rest of the site.
2.  **Performance:** Switch to Tailwind CSS via CDN.
3.  **User Experience:** Provide immediate visual feedback on authentication status using theme-appropriate indicators.

## Scope
-   `src/public/app/index.html`
-   No changes to `auth.js` logic, only DOM element targeting if IDs change (we will try to keep IDs consistent).
