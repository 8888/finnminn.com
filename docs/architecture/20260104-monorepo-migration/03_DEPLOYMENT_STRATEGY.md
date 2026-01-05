# Deployment Strategy & Migration Plan

## 1. Monorepo Setup (Manual Migration)

Since we are migrating from existing structures, we will perform the following manual steps:

1.  **Initialize Turborepo:** Create the root `package.json` and `turbo.json`.
2.  **Move Existing Code:**
    *   Move `src/public` (current landing page) into `apps/web`.
    *   Clone external repos (pip, n-dim) into `apps/pip` and `apps/n-dim`.
3.  **Standardize Dependencies:** Run `npm install` at the root to hoist shared dependencies (React, Vite) to the root `node_modules`.

## 2. Infrastructure as Code (IaC)

We are treating the **Application Code** as the primary deliverable here. The Azure resources (Static Web Apps) are already manually provisioned.

*   **Future State:** We can use Bicep to manage the Azure resources, but for this migration, we will link the existing Azure resources to the new GitHub Action workflow.

## 3. CI/CD Pipeline (GitHub Actions)

We will use a single workflow file `.github/workflows/ci-cd.yml` that handles all apps.

### Workflow Logic
1.  **Trigger:** Push to `main`.
2.  **Calculate Affected:** Turborepo checks which apps have changed.
    *   `npx turbo run build --filter=[HEAD^1]`
3.  **Deploy:**
    *   We use the **Azure Static Web Apps Deploy** action.
    *   We define **Job Matrices** or conditional steps. If `apps/web` changed, deploy to the `Finnminn` resource. If `apps/pip` changed, deploy to the `Pip` resource.

### Example Workflow Snippet

```yaml
jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Web
        run: npx turbo run build --filter=web
      
      - name: Deploy Web
        if: steps.build_web.outcome == 'success'
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_WEB }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "apps/web/dist" # Vite output
          output_location: "" 
```

## 4. Local Development

*   **Command:** `npm run dev` (at root)
*   **Behavior:** Turborepo launches all apps (Web, Pip, N-Dim) in parallel on different ports (e.g., 3000, 3001, 3002).
*   **Hot Reload:** Changes in `packages/ui` automatically trigger HMR in the apps.
