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
