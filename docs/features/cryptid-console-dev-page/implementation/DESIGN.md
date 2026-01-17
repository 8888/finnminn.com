# Design: Cryptid Console Developer Page

## Layout Architecture

The Console page will define its own layout structure to support a dedicated dashboard view.

- **Wrapper:** `min-h-screen bg-void flex flex-col relative overflow-hidden`.
- **Background:** Uses `<Atmosphere />` and a radial gradient overlay similar to `AppLauncher` but customized for a "darker/deeper" system feel.
- **Navigation:** Uses `<CommandBar />` directly.
    - **Links:**
        - Home (`/`)
        - Apps (`/apps`)
        - Console (`/console`) - Active
- **Main Content:** A centered, max-width container (`max-w-4xl`) holding the console tools.

## Components

### 1. Navigation Link
Added to the `navigation.links` array in `Apps.tsx` and the new `Console.tsx`:
- Label: "Console"
- Href: "/console"

### 2. Token Syphon (Tool)
- **Container:** `Terminal` component with title "TOKEN_SYPHON.EXE".
- **Content:**
    - A `Typography` body showing "EXTRACTING_ACTIVE_SESSION_TOKEN...".
    - A read-only `Input` (or text area styled to look like code) containing the full Bearer token.
    - A `Button` labeled "COPY_TO_CLIPBOARD" with a "toxic" (Ectoplasm) variant.
- **Interactions:**
    - Clicking "COPY" copies the string and shows a "TOKEN_COPIED" badge or success state.

## Visual Design Details

- **Colors:**
    - Background: `void` (#120B18).
    - Accents: `Ectoplasm` (#05FFA1) for system outputs, `Witchcraft` (#7D5FFF) for primary actions.
- **Atmosphere:**
    - Include `Atmosphere` component (Mana Motes, CRT Vignette).
    - Add a "System Level" header separate from the main navigation (e.g., "ROOT_ACCESS_GRANTED").

## Logic Flow

1.  User clicks "Console" in the AppLauncher navigation.
2.  `Console.tsx` renders.
3.  `useAuth()` hook is called to check authentication status.
4.  If authenticated, `acquireTokenSilent` (or similar from `@finnminn/auth`) is used to ensure we have the latest token.
5.  Token is displayed in the "Token Syphon" terminal.
6.  User interacts with the "COPY" button.