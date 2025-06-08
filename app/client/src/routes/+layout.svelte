<script lang="ts">
	import '../app.css';
	import MenuBar from '$lib/components/MenuBar.svelte';
</script>

<MenuBar />

<main>
	<slot />
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
