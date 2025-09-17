<script lang="ts">
	
import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from "@sveltejs/kit";

  import { Textarea } from "$lib/components/ui/textarea/index.js";

    import * as Card from "$lib/components/ui/card/index.js";
	import { Plus } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { serviceSchema } from "$lib/ZodSchema";
	import { superForm } from "sveltekit-superforms/client";
	import LoadingBtn from "$lib/formComponents/LoadingBtn.svelte";


	let { data } = $props();

	const { form, errors, enhance, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(serviceSchema)

		}
	);

	export const snapshot: Snapshot = { capture, restore };
// 	 function getItemNameById(items: any, value: any) {
//   const item = items.find(i=> i.value === value);
//   return item ? item.name : null; // returns null if not found
// }





</script>
<svelte:head>
	<title>Add New Service </title>
</svelte:head>
    
{#snippet fe(label = '', name = '', type = '', placeholder = '', required=false, min="", max="")}
	<div class="flex w-full flex-col gap-2 justify-start">
		<Label for={name} >{label}</Label>
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
<Card.Root class="w-lg flex flex-col gap-4">
  <Card.Header>
    <Card.Title class="text-2xl">Add New User</Card.Title>
  </Card.Header>
  <Card.Content>

<form use:enhance action="?/addProduct" id="main" class="flex flex-col gap-4" method="POST">
  {@render fe('Service Name', 'serviceName', 'text', "Enter Service Name", true)}

    <div class="flex w-full flex-col gap-2 justify-start">
		<Label for="notes" >Service Description (optional)</Label>

        <Textarea name="description" 
         placeholder="Enter added product description"			
			bind:value={$form.description}
			aria-invalid={$errors.description ? 'true' : undefined}
         />

		{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
	</div>
  {@render fe('Duration of Service', 'durationMinutes', 'number', "Enter the average number of minutes it takes to complete service", true, "0")}
  {@render fe('Price', 'price', 'number', "Enter the price of item", true, "0")}


    
		<Button type="submit" class="mt-4" form="main">
	{#if $delayed}
	
		<LoadingBtn name="Adding Service" />
	{:else}
		<Plus class="h-4 w-4" />
    
		Add Service
        {/if}
      </Button>
	</form>

    </Card.Content>
</Card.Root>