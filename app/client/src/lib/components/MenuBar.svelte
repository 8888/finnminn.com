<script lang="ts">
  import { page } from '$app/state';
</script>

<nav class="menu-bar">
  <div class="menu-container">
    <a href="/" class="menu-item" class:active={page.url.pathname === '/'}>
      Home
    </a>
    <a href="/about" class="menu-item" class:active={page.url.pathname === '/about'}>
      About
    </a>
  </div>
</nav>

<style>
  .menu-bar {
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .menu-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    gap: 1rem;
  }

  .menu-item {
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .menu-item:hover {
    background-color: #f5f5f5;
  }

  .menu-item.active {
    background-color: #e0e0e0;
    font-weight: 500;
  }
</style>
