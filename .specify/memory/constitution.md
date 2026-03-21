<!--
SYNC IMPACT REPORT
==================
Version change: [unfilled template] → 1.0.0
Modified principles: N/A (initial ratification from blank template)
Added sections:
  - Core Principles (I–V)
  - Tech Stack & Deployment Constraints
  - Development Workflow
  - Governance
Templates reviewed:
  - .specify/templates/plan-template.md        ✅ aligned (Constitution Check section present)
  - .specify/templates/spec-template.md        ✅ aligned (mandatory sections unchanged)
  - .specify/templates/tasks-template.md       ✅ aligned (phase structure compatible)
  - .specify/templates/agent-file-template.md  ✅ aligned (no principle references to update)
Deferred TODOs: none
-->

# finnminn.com Constitution

## Core Principles

### I. PixelGrim Design System (NON-NEGOTIABLE)

All UI work across every app MUST use the `@finnminn/ui` component library and
PixelGrim design tokens exclusively.

- All text MUST be rendered via `<Typography />` sub-components (H1, H2, Body,
  Code, etc.). Raw HTML heading/paragraph tags are prohibited in app code.
- Colors MUST come from Tailwind tokens (`text-witchcraft`, `text-ectoplasm`,
  `text-vampire`, `text-toxic`, `bg-void`, `bg-surface`). Hardcoded hex or rgb
  values are prohibited.
- Borders MUST be `border-2`; border-radius MUST be `rounded-none`; shadows MUST
  use `shadow-pixel` or `glow-[color]`.
- `glow={true}` MUST NOT be applied to text of size `"xs"` or `"sm"`.
- Retro fonts (VT323, Press Start 2P) MUST use a minimum of `size="xs"` (12 px).
- Every app MUST wrap its layout in the shared `CommandBar` / `Layout` components
  and include a navigation link back to `/apps`.

**Rationale**: Visual consistency across all finnminn.com properties is a brand
non-negotiable. Divergence from PixelGrim fragments the aesthetic and creates
maintenance debt in the shared package.

### II. Shared Package Discipline

Code used by more than one app MUST live in a `packages/` workspace, not be
duplicated across `apps/`.

- New shared components MUST follow the New Component Checklist: defined in
  `styleguide.toml` → implemented in `src/components/` → Storybook story added →
  Kitchen Sink updated → exported from `src/index.tsx`.
- Packages MUST be self-contained and independently importable without pulling in
  app-specific runtime state.
- No package may import from an `apps/` workspace.

**Rationale**: The monorepo's value comes from sharing. Duplication defeats the
purpose and creates divergent component behaviours over time.

### III. App Independence

Each app in `apps/` MUST be independently deployable without coupling to sibling
apps at build or runtime.

- Cross-app imports (e.g., `import { X } from '@finnminn/pip'`) are prohibited.
  Shared logic belongs in `packages/`.
- Apps MUST NOT share runtime state. Each app manages its own auth session, store,
  and router.
- API calls from each app MUST resolve through that app's configured
  `VITE_API_URL`; apps MUST NOT call another app's backend directly.

**Rationale**: Independent deployability allows individual apps to ship, roll back,
or be disabled without cascading failures across the product surface.

### IV. Serverless-First Backend

All backend logic MUST be implemented as Azure Functions. No always-on servers,
standalone Express/Ktor servers, or persistent background processes are permitted.

- Local development MUST use `./gradlew azureFunctionsRun` (port 7071) with
  Docker-hosted Cosmos DB + Azurite emulators — not live cloud services.
- `local.settings.json` files are gitignored and generated from `*.example.json`
  templates via `npm run bootstrap`. Secrets MUST NOT be committed.
- Production traffic routes via APIM Gateway → Azure Function App. Direct
  Function invocation from frontend (bypassing APIM) is prohibited in production.

**Rationale**: Serverless eliminates infrastructure management overhead and aligns
with the Azure Static Web Apps deployment model. Emulator parity prevents
environment drift.

### V. Authentication Safety

All authentication MUST use the shared `@finnminn/auth` MSAL wrapper (Microsoft
Entra ID). Direct use of MSAL APIs, custom auth middleware, or token handling
outside the shared package is prohibited.

- Before making any changes to authentication flows, `docs/guides/AUTH_DEBUGGING_AND_IMPLEMENTATION.md`
  MUST be read in full.
- The mock `x-ms-client-principal` header injected by the Vite proxy is for local
  development only; production code MUST NOT depend on it.
- If an app shows a login page or `NO_ACTIVE_ACCOUNT` error during automated
  workflows, work MUST stop and the user MUST be prompted to sign in manually.

**Rationale**: Auth bugs are high-severity. A single shared wrapper means security
patches and token-handling changes propagate uniformly across all apps.

## Tech Stack & Deployment Constraints

- **Frontend**: React + TypeScript + Vite. Tailwind CSS via `@finnminn/config`
  preset. No additional CSS-in-JS libraries.
- **Backend**: Kotlin + Gradle + Azure Functions runtime. No JVM-based HTTP servers
  (Spring Boot, Ktor, etc.).
- **Monorepo tooling**: Turborepo + npm workspaces. `npm install -g` for project
  dependencies is prohibited; all installs MUST be workspace-local.
- **Deployment**: Azure Static Web Apps (frontend) + Azure Function Apps (backend)
  - APIM Gateway. Infrastructure changes MUST use IaC (Bicep or Terraform).
- **Testing**: Vitest for frontend unit/component tests (pip has tests; other apps
  should follow). Tests are opt-in per-feature spec but encouraged for business
  logic.

## Development Workflow

- Feature development follows the spec-driven workflow:
  `/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` →
  `/speckit.implement`.
- New UI components MUST be built in Storybook (`packages/ui`) before being
  integrated into apps.
- Local environment MUST be bootstrapped via `npm run bootstrap` before first run.
  Emulators (`npm run emulators:start`) MUST be running before backend functions
  start.
- PRs MUST be reviewed against this constitution's principles. Complexity
  violations require a justification entry in the plan's Complexity Tracking table.
- Secrets and credentials MUST NOT appear in committed files. `.env`, `*.local`,
  and `local.settings.json` are gitignored by convention; this MUST NOT be
  bypassed.

## Governance

This constitution supersedes all app-level or feature-level conventions where they
conflict. In cases of ambiguity, the more restrictive rule applies.

**Amendment procedure**:

1. Propose the change in writing (PR description or design doc) with rationale.
2. If the amendment removes or redefines a principle: MAJOR version bump.
3. If the amendment adds a new principle or materially expands guidance: MINOR bump.
4. Wording clarifications or typo fixes: PATCH bump.
5. Update `LAST_AMENDED_DATE` and `CONSTITUTION_VERSION` in this file.
6. Run consistency propagation: verify all templates in `.specify/templates/`
   remain aligned; update any stale references.

**Compliance**: All PRs and spec reviews MUST verify compliance with Principles
I–V before merge. Violations flagged during review block merging unless documented
in the Complexity Tracking table of the relevant plan.

**Runtime guidance**: See `CLAUDE.md` at the repository root for day-to-day
development commands and design system rules.

---

**Version**: 1.0.0 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
