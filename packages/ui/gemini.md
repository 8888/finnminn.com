# PixelGrim UI (`@packages/ui`)

This directory contains the shared component library for the `finnminn.com` suite. It implements the **PixelGrim** design system—a "Whimsical Gothic Tech" aesthetic inspired by retro CRTs, neon magic, and brutalist utility.

## ⚡️ Operational Protocol for UI Changes

When modifying or creating components in this package, you **MUST** follow this workflow to ensure consistency and documentation integrity.

### 1. Update the Source of Truth
Before writing React code, update **`styleguide.toml`**.
- If creating a new component, define its rules, behavior, and visual intent in `[components.section]`.
- If modifying an existing one, update its description or rules to reflect the change.
- **Why?** This file serves as the contract for the design language.

### 2. Implement with "PixelGrim" Values
- **Borders:** Always `border-2`. No 1px hairlines.
- **Radius:** Always `rounded-none`. Sharp edges only.
- **Shadows:** Use `shadow-pixel` (hard edge) or `glow-[color]`.
- **Typography:** **MANDATORY** Use `<Typography />` sub-components (H1, H2, H3, Body, Code).
  - Use `variant="witchcraft" | "vampire" | "ectoplasm" | "toxic" | "pip"`.
  - Maintain minimum `12px` font size for retro fonts (use `size="xs"` prop).
- **Animation:** Diegetic only (glitches, scanlines, floating motes). No smooth "Apple-like" fades.

### 3. Storybook Hierarchy Mandate
Every component must have a corresponding `*.stories.tsx` file. **You MUST adhere to the following hierarchy** to ensure components are intuitive to find and test in isolation:

| Category | Component Types | Example Title |
| :--- | :--- | :--- |
| **System/** | Overviews, Design Specs, Style Guides | `System/Overview` |
| **Primitives/** | Atomic building blocks, typography, basic inputs | `Primitives/Button` |
| **Containers/** | Layout units, cards, terminals, modals | `Containers/Card` |
| **Media/** | Images, icons, spectral artifacts | `Media/Image` |
| **Navigation/** | HUDs, bars, menus, links | `Navigation/CommandBar` |

### 4. Continuous Integration of "All Components" View
**MANDATORY:** Any new component or significant variant **MUST** be added to the "Kitchen Sink" view to ensure visual regression testing and cross-component harmony.
- **File:** `src/stories/DesignSystem.stories.tsx`
- **Action:** Import and instantiate the component within a new `<section>` in the `AllComponents` render function.
- **Verification:** View the component at `http://localhost:6006/?path=/story/system-overview--all-components` to ensure it integrates correctly with the overall page aesthetic.

### 5. Export Public API
Ensure the component is exported in **`src/index.tsx`**.
- `export * from "./components/MyNewComponent";`

### 6. Storybook Verification (MANDATORY)
**Before marking any UI task as complete**, you must verify your changes in the running Storybook instance.
1.  **Access:** Assume Storybook is running at `http://localhost:6006/`.
2.  **Console Check:** Use the Chrome MCP to open the relevant story URL and check the DevTools console for any errors (`list_console_messages`).
3.  **Visual Audit:** Verify that the component renders correctly and "PixelGrim" styles are applied.
4.  **CSS Check:** Ensure global CSS files are properly imported and active on new pages or components.

## ✅ Checklist for New Components
- [ ] Defined in `styleguide.toml`
- [ ] Component created in `src/components/`
- [ ] Uses shared Tailwind tokens (Witchcraft, Ectoplasm, Void)
- [ ] Story created in `src/stories/`
- [ ] Added to `src/stories/DesignSystem.stories.tsx`
- [ ] Exported in `src/index.tsx`
- [ ] Checked for Accessibility (ARIA labels, keyboard nav)

## 🎨 Common Patterns
- **Colors (WCAG AA Compliant):**
  - Primary: `text-witchcraft` (#A890FF)
  - Secondary: `text-ectoplasm` (#05FFA1)
  - Danger/Radical: `text-vampire` (#FF5A8D)
  - Growth: `text-toxic` (#00FF41)
  - Background: `bg-void` (#120B18) / `bg-surface` (#221528)
- **Glitch Effect:** Use `glitch-hover` class on text or the `Image` component's artifact variant.
