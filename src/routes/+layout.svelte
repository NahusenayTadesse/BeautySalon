<script lang="ts">

    import { ModeWatcher } from "mode-watcher";
	import '../app.css';
 
  let { children } = $props();
</script>
 <ModeWatcher />

 <svelte:head>
		<link rel="icon" href="/logo.png" />
 </svelte:head>

      {@render children?.()}

    





