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

## User Story 2: Mobile Optimization for Landing Page

**As a** mobile user,
**I want** the landing page to be fully responsive and optimized for touch interactions
**So that** I can easily navigate and view content on my phone without zooming or horizontal scrolling.

**Acceptance Criteria:**

1.  **Mobile Navigation:** Implement a collapsible "System Tray" menu triggered by a `[ /// ]` button on mobile screens (< 768px). The menu should contain links to Home, Logs, Crypt, and Login.
2.  **Desktop Navigation:** Ensure the desktop navigation remains horizontal with hover states as per the style guide.
3.  **Typography:** Update heading sizes to be responsive (smaller on mobile, larger on desktop) using the `VT323` font.
4.  **Layout:** Ensure the main container and the "Terminal Frame" (hero image viewer) resize fluidly to fit within the mobile viewport width, preventing overflow.
5.  **Touch Targets:** Ensure all interactive elements (buttons, links) have a minimum height of 44px on mobile for accessibility.
6.  **Style Consistency:** Apply the "Cryptid Console" theme colors and shadows consistently across mobile and desktop views, matching `styleguide/styleguide.html`.
