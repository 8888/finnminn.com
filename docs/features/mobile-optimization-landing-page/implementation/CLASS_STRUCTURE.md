# Class Structure: Landing Page (Responsive)

## HTML Structure Changes

### Navigation (`<nav>`)
- Container: `flex justify-between items-center`.
- Desktop Menu (`div`): `hidden md:flex gap-6`.
- Mobile Toggle (`button`): `md:hidden block`.
- Mobile Menu (`div`): `hidden absolute top-full left-0 w-full`.

### Main Content (`<main>`)
- Padding: `p-4 md:p-6`.
- Flex/Alignment: `items-center justify-center`.

### Terminal Frame
- Width: `w-full max-w-4xl`.
- Height: Responsive height constraints to ensure it fits in mobile viewports.

## JavaScript State
- `isMenuOpen`: Boolean (managed via DOM class toggle).
- `clicks`: Existing counter for Finn image.
