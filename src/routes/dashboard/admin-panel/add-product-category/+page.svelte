<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { Snapshot } from '@sveltejs/kit';
	import { positionSchema } from '$lib/ZodSchema.js';

	let { data } = $props();

	const { form, errors, delayed, enhance, capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},

		validators: zod4Client(positionSchema)
	});

	export const snapshot: Snapshot = { capture, restore };
</script>

<svelte:head>
	 <title> Add Product Category</title>
</svelte:head>

{#snippet fe(
	label = '',
	name = '',
	type = '',
	placeholder = '',
	required = false,
	min = '',
	max = ''
)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name}>{label}</Label>
		<Input
			{type}
			{name}
			{placeholder}
			{required}
			{min}
			{max}
			bind:value={$form[name]}
			aria-invalid={$errors[name] ? 'true' : undefined}
		/>
		{#if $errors[name]}
			<span class="text-red-500">{$errors[name]}</span>
		{/if}
	</div>
{/snippet}

<div class="flex flex-row flex-wrap justify-between gap-16">
	<div class="my-8 flex flex-col gap-2">
		{#each data.allPositions as role}
			{role.name} <br />
			{role.description}<br />
		{/each}
	</div>

	<Card.Root class="flex w-lg flex-col gap-4">
		<Card.Header>
			<Card.Title class="text-2xl">Add New Category for Products</Card.Title>
		</Card.Header>
		<Card.Content>
			<form use:enhance action="?/addCategory" class="flex flex-col gap-4" method="post">
				{@render fe('Position Name', 'name', 'text', 'Enter Role Name', true)}

				<div>
					<Label for="description">Position Description</Label>

					<Textarea
						name="description"
						required
						placeholder="Enter role description"
						bind:value={$form.description}
						aria-invalid={$errors.description ? 'true' : undefined}
					/>

					{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
				</div>

				<Button type="submit" class="mt-4">
					{#if $delayed}
						<LoadingBtn name="Adding Role" />
					{:else}
						<Plus class="h-4 w-4" />

						Add Role
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
