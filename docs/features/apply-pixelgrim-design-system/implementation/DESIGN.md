# Design: PixelGrim Integration

## Component Mapping

| Existing Element | PixelGrim Component | Props / Notes |
| :--- | :--- | :--- |
| `<h1>FINNMINN.COM</h1>` | `Typography.H1` | Includes hover glitch effect. |
| `<p>System Status: ONLINE</p>` | `Terminal` | Wrapped with a "STATUS" title. |
| Main content wrapper | `Card` | Using `variant="magic"` for the authenticated state. |
| Login/Logout Buttons | `Button` | `variant="primary"` for Login, `variant="destructive"` for Logout. |
| Authentication status | `Typography.Body` | Styled for readability. |

## Atmosphere

### Mana Motes (Fireflies)
Implemented as a background layer in `App.tsx` using the `.firefly` utility classes from `@packages/ui/src/styles.css`. 12 instances will be added to match the CSS definitions.

### CRT Vignette
Handled via `body::after` in `@packages/ui/src/styles.css`. This will be automatically applied once the global styles are imported.

### Background
The global background is set to `void` (#120B18) in `packages/ui/src/styles.css`. We will also use `.bg-magic-void` for a shifting gradient effect on the main viewport.
