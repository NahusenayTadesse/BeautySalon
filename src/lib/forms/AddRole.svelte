<script lang="ts">
	
import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Snapshot } from "@sveltejs/kit";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import LoadingBtn from "$lib/formComponents/LoadingBtn.svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	import { Plus } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import type { CreateRoleSchema } from "$lib/ZodSchema";
    import { createRoleSchema } from "$lib/ZodSchema";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms/client";


  let { data, permissions, action="?/addRole" } : { data : SuperValidated<Infer<CreateRoleSchema>> } = $props();

	const { form, errors, enhance, delayed, capture, restore } = superForm(
		data,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},

			validators: zod4Client(createRoleSchema)

		}
	);

	export const snapshot: Snapshot = { capture, restore };
	 function getItemNameById(items: any, id: any) {
  const item = items.find(i=> i.id === id);
  return item ? item.name : null; // returns null if not found
}



</script>
    
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


<form use:enhance {action} id="main" class="flex flex-col gap-4" method="POST" >
  {@render fe('Role Name', 'name', 'text', "Enter Role Name", true)}
    

    <div class="flex w-full flex-col gap-2 justify-start">
		<Label for="notes" >Role Description </Label>

        <Textarea name="description" 
        required
         placeholder="Enter role description"			
			bind:value={$form.description}
			aria-invalid={$errors.description ? 'true' : undefined}
         />

		{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
	</div>
    <div class="flex w-full flex-col gap-2 justify-start">

        <Label for="permissions" >Add Permissions</Label>
        <!-- <div class="grid grid-cols-2 gap-2"> -->
     <ScrollArea class="h-[200px] w-full rounded-md border p-4"> 
      <div class="flex flex-col">

        {#each permissions as perm}
    <label>
      <input 
        type="checkbox" 
        name="permissions"
        value={perm.id}
        bind:group={$form.permissions}
      />
       {perm.description}
    </label>
    
  {/each}
      
  </div>
     </ScrollArea>
     {#if $errors.permissions}
				<span class="text-red-500">{$errors.permissions._errors}</span>
			{/if}
  <!-- </div> -->
  </div>
    
		<Button type="submit" class="mt-4" form="main" >
	{#if $delayed}
	
		<LoadingBtn name="Adding Role" />
	{:else}
		<Plus class="h-4 w-4" />
    
		Add Role
        {/if}
      </Button>
	</form>
