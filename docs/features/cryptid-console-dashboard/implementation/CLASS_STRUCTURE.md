# Class Structure: Cryptid Console Dashboard

This document outlines the HTML structure and Tailwind CSS class patterns for the dashboard components.

## Dashboard Shell

```html
<div id="dashboard" class="min-h-screen flex flex-col hidden">
  <nav class="bg-crypt border-b-2 border-gloom h-16 flex items-center justify-between px-6">
    <!-- Navigation Content -->
  </nav>
  <main class="flex-1 p-6 max-w-6xl mx-auto w-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Grid Sections -->
    </div>
  </main>
</div>
```

## UI Components

### App Tile
```html
<a href="..." target="_blank" class="block bg-crypt border-2 border-gloom p-6 transition-all hover:border-toxic hover:shadow-hard-toxic group">
  <div class="text-3xl mb-2 group-hover:text-toxic">[ ICON ]</div>
  <h3 class="font-heading text-2xl uppercase text-bone">Title</h3>
  <p class="text-ash text-sm">Description</p>
</a>
```

### Tool Card
```html
<section class="bg-crypt border-2 border-gloom p-6 shadow-hard-void">
  <h2 class="font-heading text-3xl text-spirit uppercase mb-4">> Tools</h2>
  <!-- Utility Buttons -->
</section>
```

### Token Viewer
```html
<div id="token-viewer" class="mt-4 hidden">
  <textarea readonly class="w-full bg-void border-2 border-gloom text-toxic p-2 font-mono text-xs h-24 mb-2"></textarea>
  <button class="...">COPY</button>
</div>
```
