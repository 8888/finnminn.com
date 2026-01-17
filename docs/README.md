# Finnminn.com Documentation

## Overview
This repository hosts the source code and documentation for `finnminn.com`, a static web application hosted on Azure.

## Features

### Mobile Optimization (Implemented Jan 2026)
- **Goal:** Ensure the landing page is fully responsive and touch-friendly.
- **Key Changes:**
    - Mobile-first navigation with a "System Tray" toggle.
    - Responsive typography and fluid layout for the hero terminal.
    - Improved touch targets.
- **Documentation:** [Mobile Optimization Feature](./features/mobile-optimization-landing-page/implementation/README.md)

### Cryptid Console Theme Integration (Implemented Jan 2026)
- **Goal:** Apply the custom 8-bit retro-tech design system to the private application section.
- **Key Changes:**
    - Replaced Bootstrap 5 with Tailwind CSS (CDN).
    - Applied custom theme colors (Void, Crypt, Radical, etc.) and fonts (VT323, Space Mono).
    - Redesigned the private dashboard UI.
- **Documentation:** [Apply Cryptid Console Feature](./features/apply-cryptid-console-to-app/implementation/README.md)

### Cryptid Console Dashboard (Implemented Jan 2026)
- **Goal:** Expand the private app into a functional dashboard with navigation and utility tools.
- **Key Changes:**
    - New dashboard layout with sticky top navigation.
    - App Launcher grid for external tools.
    - Utility Tool Box with API Token viewer.
- **Documentation:** [Cryptid Console Dashboard Feature](./features/cryptid-console-dashboard/implementation/README.md)

### PixelGrim Design System Integration (Implemented Jan 2026)
- **Goal:** Refactor the public web app to fully utilize the `@finnminn/ui` shared component library.
- **Key Changes:**
    - Replaced local CSS with shared design tokens.
    - Integrated shared `Button`, `Card`, and `Terminal` components.
    - Added global atmospheric effects (Mana Motes, CRT Vignette).
- **Documentation:** [PixelGrim Integration Feature](./features/apply-pixelgrim-design-system/implementation/README.md)

### Cryptid Console Developer Page (Implemented Jan 2026)
- **Goal:** Create a dedicated, secure page for developer utilities and configuration.
- **Key Changes:**
    - New `/console` route in `apps/web`.
    - "Token Syphon" tool for easy access to MSAL Bearer tokens.
    - Integration with the main AppLauncher navigation.
- **Documentation:** [Cryptid Console Developer Page Feature](./features/cryptid-console-dev-page/implementation/README.md)

### NecroBloom - Gothic Plant Tracker (In Progress Jan 2026)
- **Goal:** Implement an AI-driven houseplant health and care tracker.
- **Key Changes:**
    - New `apps/necrobloom` React application.
    - Kotlin Azure Function backend with Gemini 3 Flash integration.
    - Integrated with PixelGrim design system.
- **Documentation:** [NecroBloom Feature](./features/necrobloom/implementation/README.md)

## Architecture
See [Architecture Docs](./architecture/) for detailed system design.
