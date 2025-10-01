<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
  import { navigating, page, updated } from '$app/state';
  import { toastmsg, errormsg } from '$lib/global.svelte';

  const flash = getFlash(page, { clearAfterMs: 5000 });
  

	  import { ModeWatcher } from "mode-watcher";
	import { fly } from 'svelte/transition';
	import { CircleCheckBig, CircleX, Loader } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';


	let { children } = $props();

   let iconify = $state("h-6 w-6 animate-ping");

import { onMount } from 'svelte';

 

  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.error('SW registration failed:', err));
    }

	 
  });



  


</script>
<svelte:head>
		<link rel="icon" href="/logo.png" />
</svelte:head>
<ModeWatcher /> -->

{#if $flash}
 
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


{/if}


	{#if navigating.to}
  <div class="fixed -z-1 flex flex-col justify-center top-0.5 bottom-0.5 left-0.5 right-0.5 w-auto items-center">
    <div class="flex flex-row gap-2 items-center">
		  <Loader class="animate-spin w-8 h-8"/><h1 class="animate-pulse capitalize">Loading {navigating.to.url.pathname.split('/').pop()}...		 </h1>
    </div>
    </div>
	{/if}
  
{#if updated.current}
	<div class={toastmsg} transition:fly={{x:20, duration: 300  }}>
		<p>
			A new version of the app is available

			<Button onclick={() => location.reload()}>
			 	Reload the page
			</Button>
		</p>
	</div>
{/if}



{@render children()}





