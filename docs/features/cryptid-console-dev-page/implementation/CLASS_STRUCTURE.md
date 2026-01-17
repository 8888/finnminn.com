# Class Structure: Cryptid Console Developer Page

## Frontend Components (apps/web)

### `Console` Page
- **Path:** `src/pages/Console.tsx`
- **Responsibilities:**
    - Protecting the route (auth check).
    - Rendering the `CommandBar` for navigation.
    - Rendering the `Atmosphere` background.
    - Managing the "Token Syphon" state (fetching token, copy status).

### `TokenSyphon` Component (Local)
- **Path:** `src/components/Console/TokenSyphon.tsx` (Internal to `apps/web`).
- **Props:**
    - `token`: string
- **Responsibilities:**
    - Rendering the terminal interface for token display.
    - Handling the copy-to-clipboard logic.

## Shared Packages

### `@finnminn/auth`
- **Hook:** `useAuth`
- **Exports:** `getToken` (confirmed available in `useAuth` return).

### `@finnminn/ui`
- **Components:** `CommandBar`, `Terminal`, `Button`, `Typography`, `Input`, `Atmosphere`.

## Routing
- **File:** `src/App.tsx`
- **Updates:** Add `<Route path="/console" element={<Console />} />`.

## Navigation Data
- **File:** `src/pages/Apps.tsx`
- **Updates:** Add `{ label: "Console", href: "/console" }` to the links array.