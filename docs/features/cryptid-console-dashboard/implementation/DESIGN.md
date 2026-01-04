# Design: Cryptid Console Dashboard

## Layout Architecture

The dashboard will use a CSS Grid/Flexbox layout:

- **Wrapper:** `min-h-screen bg-void flex flex-col`.
- **Navigation:** `h-16 border-b-2 border-gloom flex items-center px-6 bg-crypt sticky top-0 z-50`.
- **Main Content:** `flex-1 p-6 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6`.

## Components

### 1. Navigation Bar
- **Left:** Title "FINNMINN // CONSOLE" (VT323, Radical).
- **Right:** User name (Space Mono, Bone) and Sign Out button (Toxic border).

### 2. App Launcher (Grid - span 2)
- Header: "LAUNCHER.EXE" (VT323, Toxic).
- Grid of tiles (`grid-cols-1 sm:grid-cols-2`).
- Each tile:
  - Border: 2px Gloom.
  - Hover: Border Toxic, shadow-hard-toxic.
  - Content: Icon (text-4xl), Title, Description.

### 3. Tool Box (Sidebar - span 1)
- Header: "TOOLS.SYS" (VT323, Spirit).
- Content:
  - Button: "GET TOKEN" (Radical).
  - Output Area: Hidden by default, shows token in a code-block style text area with a "COPY" button.

## Visual Design Details

- **Borders:** Always 2px, Gloom (#4b0082) or Toxic (#00ff41) on hover.
- **Shadows:** Hard 4px offsets.
- **Animations:** Subtle `translate-y-[-2px]` on hover for tiles and buttons.
- **Loading:** Maintain the "Authenticating..." pulse until MSAL resolves.

## Interaction Flow

1. User lands on `/app`.
2. `auth.js` initializes.
3. On success, `loading` div hides, `dashboard` div shows.
4. "Get Token" button calls `getToken()` from `auth.js`, populates the text area, and reveals the copy interface.
