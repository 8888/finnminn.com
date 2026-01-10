# Implementation: Apply PixelGrim Design System to Web App

This feature refactors `apps/web` to fully adopt the "PixelGrim" design system as defined in `@packages/ui/styleguide.toml` and implemented in `@packages/ui`.

## Goals
- Unified visual identity across the monorepo.
- Reduction of local CSS and ad-hoc styling in `apps/web`.
- Implementation of atmospheric effects (Mana Motes, CRT Vignette).

## Approach
1.  Remove local font imports and custom utility classes from `apps/web/src/index.css`.
2.  Update `apps/web/src/App.tsx` to use components from `@finnminn/ui`.
3.  Inject global atmospheric elements into the main layout.
