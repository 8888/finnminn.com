# Design Specification

## Technology Stack
- **HTML5:** Semantic structure.
- **Tailwind CSS (CDN):** Styling framework.
- **Google Fonts:** `VT323` and `Space Mono`.
- **Vanilla JavaScript:** For the 3-click interaction.

## UI Structure

### 1. Global Styles
- **Background:** `bg-void` (#0d0208).
- **Text:** `text-bone` (#fbe9d0).
- **Font:** `font-mono` (Space Mono) default, `font-pixel` (VT323) for headings.
- **Scroll:** Hidden (`overflow-hidden`).

### 2. Navigation Bar
- **Position:** Fixed top.
- **Height:** Minimal.
- **Content:**
    - Left: "Finnminn.exe" title (`text-radical`, `font-pixel`, `text-4xl`).
    - Right: `[ LOGIN ]` button (`border-radical`, `text-radical`, hover effects).

### 3. Main Content
- **Layout:** Flexbox centered (`flex`, `justify-center`, `items-center`, `h-screen`).
- **Component:** `Hero_Display` (Terminal Frame).
    - **Container:** `border-2`, `border-gloom`, `bg-crypt`, `shadow-hard-void`.
    - **Header:** `bg-gloom`, window title "viewer.exe".
    - **Image Wrapper:** Relative positioning.
        - **Image:** `src/public/finn.jpg`, `object-contain`.
        - **Overlay:** `.scanlines` div.
    - **Footer:** File path and status info.

## Interaction Design
- **Login Button:** Simple `<a>` tag linking to `/app`.
- **Secret Click:**
    - Event Listener on the `<img>` element.
    - Counter variable.
    - Redirect to `/app` on 3rd click.
