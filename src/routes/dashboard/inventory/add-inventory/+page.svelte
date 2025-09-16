<script lang="ts">
	
import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from "@sveltejs/kit";

  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import LoadingBtn from "$lib/formComponents/LoadingBtn.svelte";

    import * as Card from "$lib/components/ui/card/index.js";
	import { Plus } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { inventoryItemSchema } from "$lib/ZodSchema";
	import { superForm } from "sveltekit-superforms/client";


	let { data } = $props();

	const { form, errors, enhance, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(inventoryItemSchema)

		}
	);

	export const snapshot: Snapshot = { capture, restore };
	 function getItemNameById(items: any, value: any) {
  const item = items.find(i=> i.value === value);
  return item ? item.name : null; // returns null if not found
}





</script>
<svelte:head>
	<title>Add New Inventory Item </title>
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
    <Card.Title class="text-2xl">Add An Inventory Item</Card.Title>
    <Card.Description>Add New Inventory Items to track the how many have</Card.Description>
  </Card.Header>
  <Card.Content>

<form use:enhance action="?/addProduct" id="main" class="flex flex-col gap-4" method="POST" enctype="multipart/form-data">
  {@render fe('Product Name', 'productName', 'text', "Enter Product Name", true)}
    

    <div class="flex w-full flex-col gap-2 justify-start">
		<Label for="notes" >Product Description (optional)</Label>

        <Textarea name="description" 
         placeholder="Enter added product description"			
			bind:value={$form.description}
			aria-invalid={$errors.description ? 'true' : undefined}
         />

		{#if $errors.notes}<span class="text-red-500">{$errors.description}</span>{/if}
	</div>
  {@render fe('Quantity', 'quantity', 'number', "Enter the number of items the product currently has", true, "0")}
  {@render fe('Price', 'price', 'number', "Enter the price of item", true, "0")}
  {@render fe('Supplier', 'supplier', 'text', "Enter the supplier of the product", true)}


    
		<Button type="submit" class="mt-4" form="main">
	{#if $delayed}
	
		<LoadingBtn name="Adding Product" />
	{:else}
		<Plus class="h-4 w-4" />
    
		Add Product
        {/if}
      </Button>
	</form>

    </Card.Content>
</Card.Root>