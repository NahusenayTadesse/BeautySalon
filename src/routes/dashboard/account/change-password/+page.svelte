<script lang="ts">
	let { form } = $props();
	import { enhance } from '$app/forms';
	import { Loader, CircleCheck, CircleAlert, SendHorizontal, Eye, EyeOff } from 'lucide-svelte';
	import { toastmsg, redmsg } from '$lib/global.svelte';
	import { fly } from 'svelte/transition';

	let loading = $state(false);
	import { btnFilled } from '$lib/global.svelte';

	let visible = $state(false);
	let errorVisible = $state(false);

	function onsubmit() {
		loading = true;
	}

	$effect(() => {
		if (form?.success) {
			loading = false;
			visible = true;
			const timer = setTimeout(() => {
				visible = false;
			}, 5000);

			return () => {
				clearTimeout(timer);
			};
		}
	});
	$effect(() => {
		if (
			form?.error ||
			form?.formError ||
			form?.passwordError ||
			form?.mismatchError ||
			form?.weakPasswordError
		) {
			errorVisible = true;
			loading = false;
			const timer = setTimeout(() => {
				errorVisible = false;
			}, 5000);

			return () => {
				clearTimeout(timer);
			};
		}
	});

	let types = $state('password');

	function toggle() {
		if (types === 'password') {
			types = 'text';
		} else {
			types = 'password';
		}
	}

	let EyeIcon = $derived(types === 'password' ? Eye : EyeOff);
</script>

<svelte:head>
	<title>Add Customer Help</title>
	<meta name="description" content="Form to add new help articles and resources." />
</svelte:head>

{#snippet inputs(placeholder, name)}
	<div class="relative p-0">
		<input
			type={types}
			{name}
			{placeholder}
			required
			class="focus:ring-light-blue-4 focus:bg-light-blue-1 mb-5 w-full rounded-md border-1
   border-gray-200 bg-gray-50 p-3 text-base transition-discrete duration-200 ease-in-out focus:ring-1 focus:outline-none"
		/>
		<button
			type="button"
			onclick={toggle}
			title={types === 'password' ? 'Show password' : 'Hide password'}
			class="absolute top-[40%] right-3 -translate-y-1/2 transform"
		>
			<EyeIcon class="z-10 text-gray-600" />
		</button>
	</div>
{/snippet}
<div class="flex flex-col gap-4 overflow-y-auto">
	{#if visible}
		<div class={toastmsg} transition:fly={{ x: 200, duration: 500 }}>
			<CircleCheck class="h-8 w-8 justify-self-center text-white" />
			<h6 class="font-bold text-white">
				{form?.message}
				{form?.formError}
				{form?.mismatchError}
				{@html form?.weakPasswordError}
			</h6>
		</div>
	{/if}

	{#if errorVisible}
		<div class={redmsg} transition:fly={{ x: 200, duration: 500 }}>
			<CircleAlert class="h-8 w-8 justify-self-center text-white" />
			<h6 class="font-bold text-white">Oops! {form?.message}.</h6>
		</div>
	{/if}

	<h2 class="text-center">Enter Your Customer Help Here</h2>
	<form
		class="justify-centerflex mx-auto my-8 w-full flex-col items-start gap-4 rounded-xl bg-white p-8 font-sans shadow-lg lg:w-1/2"
		method="POST"
		action="?/changePassword"
		use:enhance
		{onsubmit}
	>
		{@render inputs('Enter Your Old Password', 'currentPassword')}
		{#if form?.passwordError}
			<p class="mb-4 text-sm text-red-600">{form.passwordError}</p>
		{/if}

		{@render inputs('Enter Your New Password', 'newPassword')}

		{@render inputs('Confirm Your New Password', 'confirmNewPassword')}
		{#if form?.mismatchError}
			<p class="mb-4 text-sm text-red-600">{form.mismatchError}</p>
		{/if}
		{#if form?.formError}
			<p class="mb-4 text-sm text-red-600">{form.formError}</p>
		{/if}

		{#if form?.weakPasswordError}
			<p class="mb-4 text-sm text-red-600">{@html form.weakPasswordError}</p>
		{/if}

		<button
			type="submit"
			class="{btnFilled} mt-8 flex w-full flex-row items-center justify-center gap-2"
		>
			{#if loading}
				<Loader class="animate-spin" />
			{/if}
			{loading ? 'Changing Password...' : 'Change Password'}
			<SendHorizontal />
		</button>
	</form>
</div>
