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

### Design System (Added 2026-01-03)
- **Theme:** "Cryptid Console" - A fusion of 8-bit nostalgia, gothic aesthetics, and terminal-style retro-tech.
- **Core Technologies:** Tailwind CSS (via CDN), Google Fonts (VT323, Space Mono).
- **Styling Rules:**
    - Background: `void` (#0d0208).
    - Typography: Pixelated headers, Mono body.
    - Accents: Radical Pink (#ff0055), Toxic Green (#00ff41), Spirit Cyan (#00f2ff).
- **Implementation:** The landing page (`index.html`) utilizes this system for its navigation and hero image viewer.

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

## Key Files
- `src/public/index.html`: The main landing page.
- `src/public/finn.jpg`: Image asset.
- `src/public/auth.js`: Handles MSAL configuration and login logic.
- `src/public/app/index.html`: The entry point for the private/protected application.
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
│   └───architecture/
│       ├───20260103-auth-private-section/
│       │   ├───01_ARCHITECTURE_OVERVIEW.md
│       │   ├───02_COMPONENTS.md
│       │   └───03_DEPLOYMENT_STRATEGY.md
│       ├───20251225-private-section/
│       │   ├───01_ARCHITECTURE_OVERVIEW.md
│       │   ├───02_COMPONENTS.md
│       │   └───03_DIAGRAM.md
│       └───20251227-user-authentication/
│           ├───01_ARCHITECTURE_OVERVIEW.md
│           └───02_COMPONENTS.md
└───src/
    └───public/
        ├───app/
        │   └───index.html
        ├───auth.js
        ├───finn.jpg
        └───index.html
```