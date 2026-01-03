# Design Specification

## Framework
-   **Remove:** Bootstrap 5 CDN.
-   **Add:** Tailwind CSS v3.x (via CDN script).
-   **Add:** Google Fonts (`VT323`, `Space Mono`).

## HTML Structure & Styling

### Body
-   **Background:** `bg-[#0d0208]` (Void)
-   **Font:** `font-['Space_Mono']`
-   **Layout:** Flexbox centering (`h-screen w-full flex items-center justify-center`).

### Main Container (Card)
-   **Background:** `bg-[#1a0b14]` (Crypt)
-   **Border:** `border-2 border-[#4b0082]` (Gloom)
-   **Shadow:** Hard shadow `shadow-[4px_4px_0px_0px_#0d0208]` (Void)
-   **Spacing:** `p-8 max-w-lg w-full mx-4`

### Typography
-   **Headings:** `font-['VT323'] uppercase tracking-widest`.
-   **Colors:** `text-[#fbe9d0]` (Bone) for primary text, `text-[#8a7d85]` (Ash) for secondary.

### Components

#### Loading State
-   **Text:** "AUTHENTICATING..."
-   **Style:** `text-[#00ff41]` (Toxic), `animate-pulse`, `font-['VT323'] text-2xl`.
-   **Spinner:** Custom ASCII spinner or just the pulsing text.

#### Content Section
-   **Header:** `text-3xl text-[#ff0055]` (Radical) `border-b-2 border-[#ff0055] pb-2 mb-6`.
-   **User Greeting:** Highlight username in `text-[#00ff41]` (Toxic).

#### Buttons
-   **Common:** `w-full block py-3 px-6 uppercase font-bold tracking-wider transition-all duration-75 border-2`.
-   **Primary (Test API):**
    -   Default: `bg-[#ff0055] text-[#0d0208] border-[#ff0055]`
    -   Hover: `hover:bg-[#0d0208] hover:text-[#ff0055] hover:shadow-[4px_4px_0px_0px_#ff0055] hover:-translate-y-1`
-   **Secondary (Sign Out):**
    -   Default: `bg-transparent text-[#8a7d85] border-[#4b0082]`
    -   Hover: `hover:text-[#00f2ff] hover:border-[#00f2ff] hover:shadow-[4px_4px_0px_0px_#00f2ff] hover:-translate-y-1`

## Implementation Details

### Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=VT323&display=swap" rel="stylesheet">
```

### Tailwind Configuration (in-script)
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          void: '#0d0208',
          crypt: '#1a0b14',
          bone: '#fbe9d0',
          ash: '#8a7d85',
          radical: '#ff0055',
          toxic: '#00ff41',
          spirit: '#00f2ff',
          gloom: '#4b0082',
        },
        fontFamily: {
          heading: ['"VT323"', 'monospace'],
          body: ['"Space Mono"', 'monospace'],
        },
        boxShadow: {
          'hard-radical': '4px 4px 0px 0px #ff0055',
          'hard-toxic': '4px 4px 0px 0px #00ff41',
          'hard-spirit': '4px 4px 0px 0px #00f2ff',
          'hard-void': '4px 4px 0px 0px #0d0208',
        }
      }
    }
  }
</script>
```
