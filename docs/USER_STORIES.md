# User Stories

## User Story 1: Implement "Cryptid Console" Design System on Landing Page

**As a** visitor to finnminn.com,
**I want** to see a visually striking landing page that adheres to the "Cryptid Console" design system,
**So that** I have a consistent and themed experience while navigating the site.

**Acceptance Criteria:**

1.  **Layout:**
    *   A top navigation bar contains the title "Finnminn.exe" (font-pixel, radical color) and a "[ LOGIN ]" button.
    *   The "[ LOGIN ]" button redirects to `/app`.
    *   The main content below the navigation bar is the image of Finn.
    *   The page is non-scrolling (fixed height/width to fit the viewport).
2.  **Styling (per Styleguide):**
    *   Background is `void` (#0d0208).
    *   Typography uses `VT323` (pixel) for headings and `Space Mono` for UI elements.
    *   The image of Finn is wrapped in a `hero_display` terminal frame, including:
        *   A title bar with `viewer.exe - "Good Boy"` and mock window controls.
        *   A scanline overlay at 30% opacity.
        *   A footer with mock path and status information.
3.  **Functionality:**
    *   Clicking the image 3 times redirects the user to `/app`.
    *   The "[ LOGIN ]" button redirects to `/app`.

## User Story 4: Secure Private Application Section



**As a** site administrator,

**I want** a secure, private section of the website accessible only after logging in

**So that** I can host sensitive tools or content (like a dashboard) that isn't for the public.



**Acceptance Criteria:**



1.  **Private Directory:** Create a protected route/directory (e.g., `/app/`) that serves a distinct `index.html`.

2.  **Authentication Check:** The page must automatically check for a valid active session upon loading.

3.  **Redirects:**

    *   If **unauthenticated**: Redirect the user immediately to the login flow (or back to home with a prompt).

    *   If **authenticated**: Display the private content (Dashboard).

4.  **Sign Out:** Include a "Sign Out" button within the private dashboard that clears the session and redirects to the home page.

5.  **Identity Display:** Show the logged-in user's name or username on the dashboard to confirm identity.



## User Story 5: Apply Cryptid Console Design System to Private App



**As a** user,

**I want** the private application dashboard to match the website's "Cryptid Console" theme

**So that** I have a consistent, immersive experience across the entire platform.



**Acceptance Criteria:**



1.  **Framework Replacement:** Remove Bootstrap 5 and replace it with Tailwind CSS (via CDN).

2.  **Typography:** Import and apply 'VT323' (headings) and 'Space Mono' (body) Google Fonts.

3.  **Color Palette:** Apply the specific theme colors:

    *   Background: Void (#0d0208)

    *   Card Background: Crypt (#1a0b14)

    *   Primary Text: Bone (#fbe9d0)

    *   Accents: Radical Pink (#ff0055) and Toxic Green (#00ff41).

4.  Styling Rules:

    *   Remove all border radius (sharp corners).

    *   Add 2px borders (Gloom #4b0082) to containers.

    *   Style buttons with uppercase, bold text, and hard shadows.

5.  Layout: Maintain the central card layout but aligned with the retro-tech aesthetic.

6.  Loading State: Replace the Bootstrap spinner with a retro-themed loading indicator (e.g., blinking text or a simple CSS animation).



## User Story 6: Implement Cryptid Console Dashboard for Private App



**As an** authenticated user,

**I want** a functional dashboard with a top navigation bar, a utility tool box, and an app launcher,

**So that** I can easily access connected applications and utilities in a unified "Cryptid Console" interface.



**Acceptance Criteria:**



1.  **Dashboard Layout:** The application layout is updated to a full-width dashboard structure, replacing the single centered card.

2.  **Top Menu Bar:**

    - A visible navigation bar at the top of the page.

    - Displays the application title (e.g., "FINNMINN // CONSOLE").

    - Displays the authenticated user's name.

    - Includes a visible "Sign Out" button.

3.  **Tool Box Module:**

    - A dedicated UI section (e.g., a "Tools" card).

    - Contains a "Get API Token" button.

    - When clicked, displays the current Bearer token in a read-only text area with a "Copy" button.

4.  **App Launcher:**

    - A grid section displaying application tiles.

    - **App 1:** "N-DIM" (https://n-dim.finnminn.com) - Opens in a new tab.

    - **App 2:** "PIP" (https://pip.finnminn.com) - Opens in a new tab.

    - Tiles adhere to the `components.app_tile` design specs (hover states, borders, fonts).

5.  **Design Compliance:** All elements strictly follow the "Cryptid Console" design system (Colors: Void, Radical, Toxic, Spirit; Fonts: VT323, Space Mono; Hard shadows).
