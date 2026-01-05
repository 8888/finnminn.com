# Architecture Overview: Monorepo Migration & Suite Strategy

## Executive Summary
To realize the vision of `finnminn.com` as a central "Suite" of interconnected applications (similar to the Google ecosystem), we are transitioning from isolated repositories to a unified **Monorepo** architecture. This approach enables code reuse, consistent branding via a shared Design System, and centralized authentication management, while maintaining the flexibility to deploy each application independently to its own Azure Static Web App resource.

## High-Level Architecture

The solution leverages **Turborepo** to manage the workspace. Applications (Roots) consume shared logic and UI from internal packages.

```mermaid
graph TD
    subgraph "Monorepo (Turborepo)"
        subgraph "Apps (Vite + React)"
            Web[apps/web<br/>(finnminn.com)]
            Pip[apps/pip<br/>(pip.finnminn.com)]
            NDim[apps/n-dim<br/>(n-dim.finnminn.com)]
        end

        subgraph "Shared Packages"
            UI[packages/ui<br/>(Cryptid Design System)]
            Auth[packages/auth<br/>(MSAL Wrapper)]
            Config[packages/config<br/>(TS/Eslint/Tailwind)]
        end
    end

    subgraph "Azure Cloud"
        SWA_Web[SWA: Finnminn (Root)]
        SWA_Pip[SWA: Pip]
        SWA_NDim[SWA: N-Dim]
        Entra[Entra ID (Identity Provider)]
    end

    %% Dependencies
    Web --> UI
    Web --> Auth
    Pip --> UI
    Pip --> Auth
    NDim --> UI
    NDim --> Auth

    UI --> Config
    Auth --> Config
    Web --> Config

    %% Auth Flow
    Auth -.->|OIDC / OAuth2| Entra

    %% Deployment
    Web -.->|Build & Deploy| SWA_Web
    Pip -.->|Build & Deploy| SWA_Pip
    NDim -.->|Build & Deploy| SWA_NDim
```

## Key Architectural Decisions

### 1. Monorepo (Turborepo)
*   **Why:** We have multiple apps (`web`, `pip`, `n-dim`) that share identical requirements for Authentication and Design. Managing these in separate repos leads to drift and copy-paste errors.
*   **Benefit:** Shared packages are symlinked locally. A change in `packages/ui` is instantly reflected in all apps without publishing to npm.

### 2. Client-Side Rendering (CSR) with Vite
*   **Why:** The requirement is strictly static assets (HTML/CSS/JS) for CDN distribution.
*   **Benefit:** Vite is extremely fast, lightweight, and produces highly optimized static builds perfect for Azure Static Web Apps. It avoids the complexity of server-side rendering (SSR) frameworks when no backend server is desired.

### 3. Component-Based Design System (`packages/ui`)
*   **Why:** The "Cryptid" aesthetic is specific and complex (pixel fonts, specific shadows, colors).
*   **Benefit:** Instead of copying CSS files, apps import functional components (e.g., `<CryptidButton />`, `<SystemTray />`). This ensures the "Soul" of the design is preserved everywhere.

### 4. Centralized Authentication (`packages/auth`)
*   **Why:** Authentication is hard to get right.
*   **Benefit:** All apps will wrap their root in a `<AuthProvider>` from this package. This package handles the MSAL instance, silent token acquisition, and redirect logic. If we change the Client ID or Tenant later, we change it in one place.
