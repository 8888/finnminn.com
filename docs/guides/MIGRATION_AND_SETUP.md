# Developer Guide: Migration & New App Setup

This guide provides step-by-step instructions for developer agents and humans to migrate existing applications into the `finnminn.com` monorepo or create new ones.

## 1. Starting a New App
To add a new application (e.g., `apps/new-project`) to the suite:

### Step 1: Create Directories
```bash
mkdir -p apps/new-project/src
```

### Step 2: Initialize `package.json`
Create `apps/new-project/package.json`. Ensure it is `private: true` and includes the shared packages.
```json
{
  "name": "new-project",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "@finnminn/auth": "workspace:*",
    "@finnminn/ui": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1"
  }
}
```

### Step 3: Configure Build Tools
Copy the standard configuration files from `apps/web`:
*   `tsconfig.json` (Extends `@finnminn/config/tsconfig.base.json`)
*   `vite.config.ts`
*   `tailwind.config.js` (Must include content path `../../packages/ui/src/**/*.{js,ts,jsx,tsx}`)
*   `postcss.config.js`

### Step 4: Install & Run
Run `npm install` at the root.
Run `npm run dev` to start the suite.

---

## 2. Migrating from Vanilla JS/HTML to React

### 1. Structure Analysis
*   Identify the main sections of your `index.html`. These usually become your Layout or Page components.
*   Identify any global CSS. These should be replaced by Tailwind classes from `@finnminn/ui`.

### 2. Porting to JSX
*   **HTML Tags:** Convert `class="..."` to `className="..."`. Close all self-closing tags (e.g., `<img />`, `<br />`).
*   **Script Tags:** Move logic from `<script>` tags into React `useEffect` hooks or event handlers.

### 3. Integrating Auth
**Old (Vanilla):**
```javascript
// public/auth.js
if (!getToken()) window.location.href = "/login";
```

**New (React):**
Wrap your protected content in the `useAuth` hook logic.
```tsx
import { useAuth } from "@finnminn/auth";

export default function App() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Login via Entra ID</button>;
  }

  return <Dashboard />;
}
```

### 4. Integrating Design System
**Old (CSS):**
```html
<div class="system-tray">...</div>
```

**New (UI Package):**
```tsx
import { SystemTray } from "@finnminn/ui";

return <SystemTray />;
```

---

## 3. Hybrid Apps (React + Serverless Kotlin)

For applications that require a backend API (Azure Functions) written in **Kotlin** alongside the React frontend.

### Folder Structure
We recommend nesting the API within the app folder to keep the "Feature" together.

```
apps/pip/
├── package.json        # Frontend dependencies (React)
├── vite.config.ts      # Frontend build config
├── src/                # React Source Code
│   ├── App.tsx
│   └── components/
└── api/                # Azure Functions (Kotlin)
    ├── pom.xml         # Maven build file (or build.gradle)
    ├── host.json       # Azure Functions host config
    ├── local.settings.json
    └── src/
        └── main/
            └── kotlin/
                └── com/
                    └── finnminn/
                        └── pip/
                            └── Function.kt
```

### Configuration Changes

#### 1. `.gitignore`
Ensure you ignore build artifacts for both Node and Java/Kotlin.
```
# Standard Node
node_modules
dist

# Java/Kotlin
target/
build/
.gradle/
.idea/
```

#### 2. Local Development
*   **Environment Preparation**: Run `npm run bootstrap` at the root to start emulators and generate local settings.
*   **Frontend:** Run `npm run dev -- --filter=<app>` to serve the React app on localhost:5173.
*   **Backend:** Navigate to the `api/` directory and run the function host.
    ```bash
    cd apps/<app>/api
    ./gradlew azureFunctionsRun
    ```
*   **Proxy:** Ensure your `vite.config.ts` includes the standard proxy configuration with the mock principal header (see `apps/pip/vite.config.ts` for reference).

#### 3. Deployment (GitHub Actions)
The Azure Static Web Apps Action handles "Standard" functions (Node/Python) automatically. For **Java/Kotlin**, the build process is slightly different.

**Option A: Managed Functions (Standard)**
SWA supports Java 11/17. You point the workflow to the `api` folder.
```yaml
app_location: "apps/pip/dist"
api_location: "apps/pip/api"
```
*Note: SWA will attempt to build the Maven project. Ensure `pom.xml` is in `apps/pip/api`.*

**Option B: Bring Your Own Backend (BYOB)**
If the Kotlin app is complex, deploy it as a standalone **Azure Function App** resource, and link it to the Static Web App via "Bring Your Own Backend" in the Azure Portal.
*   **Pros:** Independent scaling, full control over runtime.
*   **Cons:** Separate deployment workflow needed for the Function App.

### Calling the API
In your React client (`apps/pip/src/App.tsx`), use the Access Token from `@finnminn/auth`.

```tsx
import { useAuth } from "@finnminn/auth";

const { getToken } = useAuth();

async function callApi() {
  const token = await getToken();
  const res = await fetch("/api/my-function", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  // ...
}
```
