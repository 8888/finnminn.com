# Project: finnminn.com

## Overview
This project contains the source code and configuration for the static website `finnminn.com`, hosted on **Azure Static Web Apps**.

### Architecture
- **Azure Resource Group:** `Finnminn-rg`
- **Azure Static Web Apps:** A Free tier Static Web App named `Finnminn` hosts the website content.
    - Provides global hosting, CI/CD integration, and free SSL.
- **Azure DNS:** A DNS zone `Finnminn.com` manages the domain records.

### Authentication & Security (Added 2026-01-03)
- **Identity Provider:** Microsoft Entra ID (configured as a Single Tenant or Multi-tenant app).
- **Authentication Pattern:** Client-Side Authentication (SPA) using **MSAL.js**.
- **Private Section:** Located at `https://finnminn.com/app`.
    - Protected by JavaScript logic that checks for a valid Entra ID token.
    - Redirects unauthenticated users to the Microsoft login flow.
- **Cross-Resource Access:** The acquired Access Token can be used as a Bearer token to authorize requests to external/standalone Azure Functions.

### Design System (Updated 2026-01-03)
- **Source of Truth:** `styleguide/styleguide.toml` (Version 1.1.0).
- **Theme:** "Cryptid Console" - A fusion of 8-bit nostalgia, gothic aesthetics, and terminal-style retro-tech.
- **Strategy:** Mobile-First, Responsive.
- **Core Technologies:** Tailwind CSS (via CDN), Google Fonts (VT323, Space Mono).
- **Styling Rules:**
    - Background: `void` (#0d0208).
    - Typography: Pixelated headers (`VT323`), Mono body (`Space Mono`).
    - Accents: Radical Pink (#ff0055), Toxic Green (#00ff41), Spirit Cyan (#00f2ff).
- **Implementation:**
    - Landing Page (`src/public/index.html`): Mobile-optimized with "System Tray" navigation.
    - App Console (`src/public/app/index.html`): Private dashboard with grid layout.

## Deployment
Deployment is automated using GitHub Actions.
- **Workflow File:** `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`
- **Trigger:** Pushes to the repository trigger a build and deploy to the Static Web App.

### Manual Resources
The Azure resources were created manually in the Azure Portal.
- Resource Group: `Finnminn-rg`
- Static Web App: `Finnminn`
- DNS Zone: `Finnminn.com`
- **App Registration:** `Finnminn-Web` (Client ID: `5e24adce-63ed-4c99-86d3-d8b4d1dfb211`)

## Testing & Validation
- **HTML Validation:** `node test/validate_app_html.js` ensures the application's HTML structure adheres to expected standards (e.g., avoiding duplicate IDs).

## Key Files
- `src/public/index.html`: The main landing page (Mobile-First).
- `src/public/app/index.html`: The entry point for the private/protected application (Cryptid Console).
- `styleguide/styleguide.toml`: The central configuration for the Design System.
- `src/public/auth.js`: Handles MSAL configuration and login logic.
- `.github/workflows/...`: CI/CD pipeline definition.

## Folder Structure
```
/Users/leecostello/Documents/code/lee/finnminn.com/
├───.DS_Store
├───GEMINI.md
├───.git/...
├───.github/
│   └───workflows/
│       └───azure-static-web-apps-mango-pebble-0e55b260f.yml
├───docs/
│   ├───architecture/
│   │   ├───20260103-auth-private-section/
│   │   └───...
│   └───features/
│       ├───apply-cryptid-console-to-app/
│       ├───cryptid-console-dashboard/
│       ├───implement-cryptid-design/
│       └───mobile-optimization-landing-page/
├───src/
│   └───public/
│       ├───app/
│       │   └───index.html
│       ├───auth.js
│       ├───finn.jpg
│       └───index.html
├───styleguide/
│   ├───styleguide.html
│   └───styleguide.toml
└───test/
    └───validate_app_html.js
```