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
- `apps/pip`: Serverless thought capture and habit tracker (`pip.finnminn.com`). Features a "Capture First" terminal and Kotlin Azure Function backend.
- `apps/necrobloom`: Gothic plant tracker (`necrobloom.finnminn.com`). AI-powered identification and care plans.
- *Future*: `apps/n-dim`.

#### Shared Packages (`packages/`)
- `@finnminn/ui`: Shared React component library implementing the "PixelGrim" design system.
- `@finnminn/auth`: Shared authentication logic and React hooks for MSAL integration.
- `@finnminn/config`: Centralized configuration for Tailwind, TypeScript, and ESLint.

## Authentication & Security
- **Identity Provider:** Microsoft Entra ID (Client ID: `5e24adce-63ed-4c99-86d3-d8b4d1dfb211`).
- **Implementation:** React Context (`AuthProvider`) and hooks (`useAuth`) provided by `@finnminn/auth`.
- **Strategy:** Single Page Application (SPA) flow with silent token acquisition and redirect-based login.

## API Routing Strategy
- **Pattern:** APIM Gateway (Recommended for SWA Free Tier).
- **Rationale:** Azure Static Web Apps (Free) do not support linking separate Function Apps ("Bring your own API"). To keep backends decoupled while avoiding the Standard SKU costs, we route API traffic through **Azure API Management (APIM)**.
- **Implementation:**
    - Frontend calls use an absolute base URL provided by `VITE_API_URL` (configured in `.env.production`).
    - Backend Function Apps must have CORS configured to allow the SWA hostnames (e.g., `pip.finnminn.com`).
    - Local development continues to use the Vite proxy to `localhost:7071`.

## Design System: "PixelGrim"
- **Aesthetic:** "Whimsical Gothic Tech" — an enchanted CRT experience blending 8-bit nostalgia, ghostly magic, and terminal utility.
- **Source of Truth:** `@finnminn/ui` (Components) and `packages/config/tailwind.config.js` (Tokens).
- **Core Visuals:**
    - **Background:** Grape Charcoal `void` (#120B18) with animated gradients and noise texture.
    - **Typography:** Headers (`VT323` / `Press Start 2P`), Body (`Space Mono`).
    - **Palette:**
        - Primary: Witchcraft (#A890FF) / Radical (#FF5A8D)
        - Secondary: Ectoplasm (#05FFA1) / Toxic (#00FF41)
        - Base: Void (#120B18)

## Development Guidelines
- **Local Setup**: Follow the [Local Installation Guide](docs/guides/local/INSTALLATION.md) for environment setup, emulators, and SSL certificates.
- **Agent Workflow**: For AI agents working on this repo, refer to the [Agent Local Development Workflow](docs/guides/local/AGENT_WORKFLOW.md).
- **Authentication**: **MANDATORY:** For any changes involving authentication or authenticated APIs, you MUST consult [docs/guides/AUTH_DEBUGGING_AND_IMPLEMENTATION.md](docs/guides/AUTH_DEBUGGING_AND_IMPLEMENTATION.md).
- **UI Development:** Components are located in `packages/ui/src/components`. **MANDATORY:**
    - Follow the instructions in `packages/ui/gemini.md` for any changes to shared components.
    - Use `<Typography />` components for all text to ensure WCAG AA (4.5:1) contrast compliance.
    - Maintain a minimum font size of `12px` for retro fonts (`VT323`, `Press Start 2P`).
- **Authentication Prompt:** When running the application locally, if the agent detects it is not authenticated (e.g., seeing a login page or "NO_ACTIVE_ACCOUNT" errors), it **MUST** stop and ask the USER to sign in manually before proceeding with any UI or integration tasks.
- **New Apps:** Follow the guide in `docs/guides/MIGRATION_AND_SETUP.md`.

## Deployment (CI/CD)
Automated via GitHub Actions with decoupled workflows.

### 1. Frontend & Shared Packages
- **Workflows:** 
  - `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml` (Web, Pip)
  - `.github/workflows/azure-static-web-apps-zealous-tree-08c25ec0f.yml` (NecroBloom)
- **Triggers:** Changes to `apps/web`, `apps/pip`, `apps/necrobloom` (frontend), or `packages/*`.
- **Logic:** Uses job filtering to only build and deploy the specific app that changed.
- **Hosting:** Deploys to Azure Static Web Apps (`Finnminn`, `Pip-web-app`, `necrobloom-web`).

### 2. Backend (Azure Functions)
- **Workflows:** 
  - `.github/workflows/deploy-pip-backend.yml`
  - `.github/workflows/deploy-necrobloom-backend.yml`
- **Triggers:** Changes to `apps/pip/api/**` or `apps/necrobloom/api/**`.
- **Logic:** Builds the Kotlin project using Gradle and deploys to the respective Function App (`pip-tracker`, `necrobloom-api`).

## Azure Infrastructure Quick Reference
- **Subscription ID:** `892ba278-02fb-4119-90b3-83778aacc71f` (Finnminn Production)
- **Primary Resource Groups:**
    - `necrobloom-rg`: Gothic Plant Tracker (`necrobloom.finnminn.com`)
    - `pip-rg`: Habit Tracker (`pip.finnminn.com`)
    - `Finnminn`: Main landing page and shared identity resources

## Folder Structure

```
/Users/leecostello/Documents/code/lee/finnminn.com/
├───apps/
│   ├───web/                 # Main landing page (React + Vite)
│   ├───pip/                 # Habit Tracker
│   │   ├───src/             # React Frontend
│   │   └───api/             # Kotlin Backend (Azure Functions)
│   └───necrobloom/          # Gothic Plant Tracker
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
