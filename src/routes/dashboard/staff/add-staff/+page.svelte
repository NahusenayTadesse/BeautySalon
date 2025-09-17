<script lang="ts">
	
import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from "@sveltejs/kit";
    import * as Card from "$lib/components/ui/card/index.js";
	import { Plus } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { staffSchema } from "$lib/ZodSchema";
	import { superForm } from "sveltekit-superforms/client";
	import LoadingBtn from "$lib/formComponents/LoadingBtn.svelte";
	import SelectComp from "$lib/formComponents/SelectComp.svelte";


	let { data } = $props();

	const { form, errors, enhance, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(staffSchema)

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
{#snippet selects(name, items)}

<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
    
{/snippet}
<Card.Root class="w-lg flex flex-col gap-4">
  <Card.Header>
    <Card.Title class="text-2xl">Add New Staff Member</Card.Title>
  </Card.Header>
  <Card.Content>

<form use:enhance action="?/addProduct" id="main" class="flex flex-col gap-4" method="POST">
  {@render fe('First Name', 'firstName', 'text', "Enter Staff's First Name", true)}
  {@render fe('Last Name', 'lastName', 'text', "Enter Staff's last Name", true)}
  {@render fe('Email', 'email', 'email', "Enter Email", true)}
  {@render fe('Phone', 'phone', 'tel', "Enter Phone Number", true)}
  {@render selects('position', data?.allPositions)}
  
    
		<Button type="submit" class="mt-4" form="main">
	{#if $delayed}
	
		<LoadingBtn name="Adding Staff" />
	{:else}
		<Plus class="h-4 w-4" />
    
		Add Staff
        {/if}
      </Button>
	</form>

    </Card.Content>
</Card.Root>