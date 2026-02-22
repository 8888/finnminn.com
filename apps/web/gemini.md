# Finnminn Web - Root Portal

## Project Overview
This is the main landing page and root portal for the `finnminn.com` suite. It serves as the directory for all sub-applications and provides the primary interface for the "PixelGrim" design system.

## Architecture
Integrated into the `finnminn.com` monorepo as the flagship application.

- **Frontend**: React + Vite SPA.
- **Identity**: Centralized Microsoft Entra ID (via `@finnminn/auth`).
- **Design System**: PixelGrim (via `@finnminn/ui`). **MANDATORY:** Use `<Typography />` components for all text to maintain accessibility standards.

### Folder Structure
- `apps/web/src/`: React frontend source code.
- `apps/web/public/`: Static assets (e.g., `finn.jpg`).

## Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS.
- **Build System**: npm (root) + Turborepo.
- **Hosting**: Azure Static Web Apps (Free Tier).

## Deployed Infrastructure (Resource Group: `Finnminn-rg`)
| Resource Name | Type | Location | Details |
| :--- | :--- | :--- | :--- |
| **Finnminn** | Static Web App | `eastus2` | Hosts the root website. |
| **Finnminn.com** | DNS Zone | `global` | Managed DNS for the suite. |

## Getting Started

### Local Development
From the monorepo root:
```bash
npm run dev -- --filter=web
```

### Build
```bash
npx turbo run build --filter=web
```

## CI/CD
Managed via `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`.
- The workflow uses a conditional job to deploy only when the web app or shared packages are modified.
- Deployment points directly to the `apps/web/dist` folder.

## Features & Implementation
- **Atmosphere**: Uses the `Atmosphere` component with animated "Mana Motes" (fireflies).
- **System Log**: A terminal-style interface displaying system initialization and link status.
- **Artifact Imaging**: Uses the `Image` component with the `artifact` variant for specimen presentation.
