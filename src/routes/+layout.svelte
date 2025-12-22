<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
	import { navigating, page, updated } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { toastmsg, errormsg } from '$lib/global.svelte';

	const flash = getFlash(page, { clearAfterMs: 5000 });

	import { ModeWatcher } from 'mode-watcher';
	import { fly } from 'svelte/transition';
	import { CircleCheckBig, CircleX, Loader } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	let { children } = $props();

	let iconify = $state('h-6 w-6 animate-ping');

	$effect(() => {
		if (!$flash) return;
		if (page.data.flash?.type === 'success') toast.success($flash.message);
		if (page.data.flash?.type === 'error') toast.error($flash?.message);
		$flash = undefined;
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.png" />
</svelte:head>
<ModeWatcher />
<Toaster position="bottom-right" richColors closeButton />

<!-- {#if $flash}

  <div class="flex flex-row gap-2
  {$flash.type==='success' ? toastmsg: errormsg}"
  transition:fly={{x:20, duration: 300  }}>
  {#if $flash.type==='success'}
    <CircleCheckBig class={iconify} />
   {:else}
   <CircleX class={iconify} />
  {/if}
    {$flash.message}

  </div>


{/if} -->

{#if navigating.to}
	<div
		class="fixed top-0.5 right-0.5 bottom-0.5 left-0.5 z-1 flex w-auto flex-col items-center justify-center"
	>
		<div class="flex flex-row items-center gap-2">
			<Loader class="h-8 w-8 animate-spin" />
			<h2 class="animate-pulse capitalize">Loading...</h2>
		</div>
	</div>
{/if}

{#if updated.current}
	<div class={toastmsg} transition:fly={{ x: 20, duration: 300 }}>
		<p>
			A new version of the app is available

			<Button onclick={() => location.reload()}>Reload the page</Button>
		</p>
	</div>
{/if}
{@render children()}
