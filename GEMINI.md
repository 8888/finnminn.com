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
- *Future*: `apps/pip`, `apps/n-dim`.

#### Shared Packages (`packages/`)
- `@finnminn/ui`: Shared React component library implementing the "PixelGrim" design system. Integrated with **Storybook** for component documentation and testing.
- `@finnminn/auth`: Shared authentication logic and React hooks for MSAL integration.
- `@finnminn/config`: Centralized configuration for Tailwind, TypeScript, and ESLint.

## Authentication & Security
- **Identity Provider:** Microsoft Entra ID (Client ID: `5e24adce-63ed-4c99-86d3-d8b4d1dfb211`).
- **Implementation:** React Context (`AuthProvider`) and hooks (`useAuth`) provided by `@finnminn/auth`.
- **Strategy:** Single Page Application (SPA) flow with silent token acquisition and redirect-based login.

## Design System: "PixelGrim"
- **Aesthetic:** "Whimsical Gothic Tech" — an enchanted CRT experience blending 8-bit nostalgia, ghostly magic, and terminal utility.
- **Source of Truth:** `packages/ui/styleguide.toml` (Design tokens & logic) and `packages/config/tailwind.config.js` (Implementation).
- **Component Documentation:** Visualized via **Storybook** (`npm run storybook` from root).
- **Core Visuals:**
    - **Background:** Grape Charcoal `void` (#120B18) with animated gradients (`.bg-magic-void`) and noise texture.
    - **Typography:** Headers (`VT323` / `Press Start 2P`), Body (`Space Mono`).
    - **Atmosphere:** Mana Motes (floating fireflies), CRT Vignette, and single-burst Glitch Text on hover.
    - **Palette:**
        - Primary: Witchcraft (#7D5FFF) - Electric Indigo magic.
        - Secondary: Ectoplasm (#05FFA1) - Spectral Mint system status.
        - Destructive: Vampire Kiss (#FF2A6D) - Radical Raspberry danger.

## Development Guidelines
- **UI Development:** Components are located in `packages/ui/src/components`. Always update or add **Storybook stories** in `packages/ui/src/stories` when creating or modifying components.
- **Style Consistency:** Refer to `packages/ui/styleguide.toml` for the "Why" behind design decisions.

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
│   └───ui/                  # Shared React components (PixelGrim System)
│       ├───styleguide.toml  # Design Source of Truth
│       └───src/
│           ├───components/  # Atomic components (Button, Card, etc.)
│           └───stories/     # Storybook documentation
├───docs/
│   ├───architecture/        # Design docs and migration plans
│   ├───features/            # Implementation details for key features
│   ├───guides/              # Onboarding and setup guides
│   ├───legacy-styleguide/   # Archive of original TOML spec
│   └───USER_STORIES.md      # Product roadmap and acceptance criteria
├───package.json             # Root workspace config
├───turbo.json               # Turborepo task pipeline
└───tsconfig.json            # Global TypeScript references
```
