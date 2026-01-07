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
- `apps/web`: The root landing page and suite directory (`finnminn.com`).
- *Future*: `apps/pip`, `apps/n-dim`.

#### Shared Packages (`packages/`)
- `@finnminn/ui`: Shared React component library implementing the "Cryptid Console" design system. Integrated with **Storybook** for component documentation and testing.
- `@finnminn/auth`: Shared authentication logic and React hooks for MSAL integration.
- `@finnminn/config`: Centralized configuration for Tailwind, TypeScript, and ESLint.

## Authentication & Security
- **Identity Provider:** Microsoft Entra ID (Client ID: `5e24adce-63ed-4c99-86d3-d8b4d1dfb211`).
- **Implementation:** React Context (`AuthProvider`) and hooks (`useAuth`) provided by `@finnminn/auth`.
- **Strategy:** Single Page Application (SPA) flow with silent token acquisition and redirect-based login.

## Design System: "Cryptid Console"
- **Aesthetic:** A fusion of 8-bit nostalgia, gothic aesthetics, and terminal-style retro-tech.
- **Source of Truth:** `@finnminn/config/tailwind.config.js` (tokens) and `@finnminn/ui` (components).
- **Component Documentation:** Visualized via **Storybook** (`npm run storybook` from root).
- **Core Visuals:**
    - Background: `void` (#0d0208).
    - Typography: Headers (`VT323`), Body (`Space Mono`).
    - Accents: Radical Pink (#ff0055), Toxic Green (#00ff41), Spirit Cyan (#00f2ff).

## Development Guidelines
- **UI Development:** Always update or add **Storybook stories** in `packages/ui/src/stories` when creating or modifying components in `@finnminn/ui`.
- **Testing:** Ensure changes are verified visually in Storybook before committing.

## Deployment (CI/CD)
Automated via GitHub Actions.
- **Workflow File:** `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`
- **Build Flow:** Turbo calculates affected packages and builds apps using Vite.
- **Deployment Flow:** Azure Static Web Apps Action uploads the pre-built `dist/` folder for the relevant app.

## Folder Structure
```
/Users/leecostello/Documents/code/lee/finnminn.com/
├───apps/
│   └───web/                 # Main landing page (React + Vite)
├───packages/
│   ├───auth/                # Shared MSAL/Auth logic
│   ├───config/              # Shared Tailwind/TS/Lint configs
│   └───ui/                  # Shared React components (Cryptid System)
├───docs/
│   ├───architecture/        # Design docs and migration plans
│   └───legacy-styleguide/   # Archive of original TOML spec
├───package.json             # Root workspace config
├───turbo.json               # Turborepo task pipeline
└───tsconfig.json            # Global TypeScript references
```
