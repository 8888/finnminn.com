# Project: finnminn.com

## Overview
This project contains the source code and configuration for the `finnminn.com` application suite, structured as a **Turborepo Monorepo**. It hosts the main landing page and serves as the foundation for shared design and authentication logic across multiple subdomains (e.g., `pip.finnminn.com`, `n-dim.finnminn.com`).

## Architecture
- **Repository Pattern:** Monorepo using **Turborepo** and **npm workspaces**.
- **Frontend Stack:** **React** + **Vite** + **Tailwind CSS**.
- **Deployment:** Each application in `apps/` is deployed to its own **Azure Static Web App** resource.
- **Identity:** Centralized **Microsoft Entra ID** authentication via a shared MSAL wrapper.

### Key Workspaces
#### Applications (`apps/`)
- `apps/web`: The root landing page and suite directory (`finnminn.com`). Fully integrated with `@finnminn/ui` as the reference implementation for the PixelGrim design system.
- `apps/pip`: Serverless habit tracker (`pip.finnminn.com`). Contains both the React frontend (`src`) and the Kotlin Azure Function backend (`api`).
- *Future*: `apps/n-dim`.

#### Shared Packages (`packages/`)
- `@finnminn/ui`: Shared React component library implementing the "PixelGrim" design system.
- `@finnminn/auth`: Shared authentication logic and React hooks for MSAL integration.
- `@finnminn/config`: Centralized configuration for Tailwind, TypeScript, and ESLint.

## Authentication & Security
- **Identity Provider:** Microsoft Entra ID (Client ID: `5e24adce-63ed-4c99-86d3-d8b4d1dfb211`).
- **Implementation:** React Context (`AuthProvider`) and hooks (`useAuth`) provided by `@finnminn/auth`.
- **Strategy:** Single Page Application (SPA) flow with silent token acquisition and redirect-based login.

## Design System: "PixelGrim"
- **Aesthetic:** "Whimsical Gothic Tech" — an enchanted CRT experience blending 8-bit nostalgia, ghostly magic, and terminal utility.
- **Source of Truth:** `@finnminn/ui` (Components) and `packages/config/tailwind.config.js` (Tokens).
- **Core Visuals:**
    - **Background:** Grape Charcoal `void` (#120B18) with animated gradients and noise texture.
    - **Typography:** Headers (`VT323` / `Press Start 2P`), Body (`Space Mono`).
    - **Palette:**
        - Primary: Witchcraft (#7D5FFF) / Radical (#FF0055)
        - Secondary: Ectoplasm (#05FFA1) / Toxic (#00FF41)
        - Base: Void (#0D0208)

## Development Guidelines
- **UI Development:** Components are located in `packages/ui/src/components`.
- **New Apps:** Follow the guide in `docs/guides/MIGRATION_AND_SETUP.md`.

## Deployment (CI/CD)
Automated via GitHub Actions with decoupled workflows.

### 1. Frontend & Shared Packages
- **Workflow:** `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`
- **Triggers:** Changes to `apps/web`, `apps/pip` (frontend), or `packages/*`.
- **Logic:** Uses job filtering to only build and deploy the specific app that changed.
- **Hosting:** Deploys to Azure Static Web Apps (`Finnminn` for web, `Pip-web-app` for pip).

### 2. Backend (Azure Functions)
- **Workflow:** `.github/workflows/deploy-pip-backend.yml`
- **Triggers:** Changes to `apps/pip/api/**`.
- **Logic:** Builds the Kotlin project using Gradle and deploys to the `pip-tracker` Function App in Azure.

## Folder Structure
```
/Users/leecostello/Documents/code/lee/finnminn.com/
├───apps/
│   ├───web/                 # Main landing page (React + Vite)
│   └───pip/                 # Habit Tracker
│       ├───src/             # React Frontend
│       └───api/             # Kotlin Backend (Azure Functions)
├───packages/
│   ├───auth/                # Shared MSAL/Auth logic
│   ├───config/              # Shared Tailwind/TS/Lint configs
│   └───ui/                  # Shared React components (PixelGrim System)
├───docs/
│   ├───architecture/        # Design docs and migration plans
│   ├───features/            # Implementation details for key features
│   ├───guides/              # Onboarding and setup guides
│   └───USER_STORIES.md      # Product roadmap and acceptance criteria
├───package.json             # Root workspace config
├───turbo.json               # Turborepo task pipeline
└───tsconfig.json            # Global TypeScript references
```