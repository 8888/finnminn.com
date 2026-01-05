# Component & Service Specifications

## 1. Cloud Services

| Service | Category | Justification | Documentation |
| :--- | :--- | :--- | :--- |
| **Azure Static Web Apps** | Hosting | Zero-config global hosting for static content. Supports custom domains and free SSL. We use one resource per App to allow independent scaling and domain mapping. | [Link](https://learn.microsoft.com/en-us/azure/static-web-apps/overview) |
| **Microsoft Entra ID** | Identity | Enterprise-grade identity management. Used for Single Sign-On (SSO) across the suite. | [Link](https://learn.microsoft.com/en-us/entra/identity/) |
| **GitHub Actions** | CI/CD | Native integration with our repo. Orchestrates the Turborepo build and deploys artifacts to Azure. | [Link](https://docs.github.com/en/actions) |

## 2. Shared Packages

### `packages/ui` (The Design System)
*   **Role:** Exports React components and Tailwind configurations.
*   **Key Exports:**
    *   `Button`, `Card`, `Modal`: Basic UI building blocks.
    *   `Layout`: The standard shell (Navbar, System Tray).
    *   `theme`: A Tailwind preset object containing the "Cryptid" color palette and font stacks.
*   **Tech:** React, Tailwind CSS, Headless UI (for accessible primitives).

### `packages/auth` (The Gatekeeper)
*   **Role:** Wraps the MSAL.js library into a simpler React Context.
*   **Key Exports:**
    *   `AuthProvider`: The context provider component.
    *   `useAuth()`: Hook returning `{ user, login, logout, getToken }`.
    *   `ProtectedRoute`: A component that redirects to login if the user is unauthenticated.
*   **Tech:** `@azure/msal-browser`, `@azure/msal-react`.

### `packages/config` (The Standards)
*   **Role:** Single source of truth for build tools.
*   **Key Exports:**
    *   `eslint-preset`: Shared linting rules.
    *   `tsconfig.base.json`: Shared TypeScript compiler options.
    *   `tailwind.config.js`: Shared Tailwind setup (if not in UI).

## 3. Applications

### `apps/web` (The Hub)
*   **URL:** `finnminn.com`
*   **Role:** The landing page and directory.
*   **Content:** Marketing for the suite, links to other apps, basic "About" info.

### `apps/pip` (The Utility)
*   **URL:** `pip.finnminn.com`
*   **Role:** A specific utility application (details TBD by existing repo).
*   **Integration:** Consumes `packages/auth` to ensure only valid Finnminn users can access it.

### `apps/n-dim` (The Explorer)
*   **URL:** `n-dim.finnminn.com`
*   **Role:** A high-dimensional data visualization tool.
*   **Integration:** Heavily relies on `packages/ui` for complex control panels.
