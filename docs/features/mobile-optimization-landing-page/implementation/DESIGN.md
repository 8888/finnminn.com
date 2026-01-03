# Design: Mobile Optimization

## Responsive Strategy: Mobile-First
We will use Tailwind's breakpoint prefixes (`md:`, `lg:`) to enhance the mobile-default styles for larger screens.

### 1. Navigation
- **Mobile (< 768px):**
  - Brand name: `text-3xl font-pixel`.
  - Hamburger button: `[ /// ]` (VT323, Toxic Green, 2px border).
  - Menu: Absolute positioned "System Tray" modal that slides down.
  - Links: Stacked vertically, `bg-crypt`, `border-gloom`, `min-h-[44px]`.
- **Desktop (>= 768px):**
  - Brand name: `text-4xl font-pixel`.
  - Hamburger button: Hidden (`hidden`).
  - Menu: Horizontal flex layout (`flex`).
  - Links: Inline with hover effects.

### 2. Typography Scale
| Element | Mobile Size | Desktop Size | Font |
|---------|-------------|--------------|------|
| H1 (Brand) | 3xl | 4xl | VT323 |
| Title Bar | xs | xs | VT323 |
| Footer Text | 10px | 10px | Space Mono |
| Login Button | Large Block | Compact | VT323/Mono |

### 3. Hero Display (Terminal Frame)
- **Container:** `w-full` on mobile, `max-w-4xl` on desktop.
- **Image:** `object-contain`, ensuring it doesn't overflow the viewport height (especially on mobile landscape).
- **Footer:** Stack vertically on very small screens if necessary, otherwise maintain horizontal layout.

### 4. Interactions
- Use `active:` classes to mimic hover states for touch users (shadow shifts, color inversions).
- Increase padding on buttons for a minimum 44px hit area.

## Technical Details
- **Toggle Logic:** Simple vanilla JavaScript to toggle the `hidden` class on the mobile menu.
- **Tailwind Config:** Ensure `radical`, `toxic`, `spirit`, `gloom` colors are correctly mapped (already done in `index.html`).
