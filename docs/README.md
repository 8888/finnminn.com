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

## Architecture
See [Architecture Docs](./architecture/) for detailed system design.