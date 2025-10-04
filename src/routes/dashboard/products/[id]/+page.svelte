<script lang='ts'>
    import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
    import { bookingFeeSchema } from '$lib/zodschemas/appointmentSchema';
	import { editAppointment, editProduct } from '$lib/ZodSchema';
  

  let { data } = $props();

   import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm } from 'sveltekit-superforms/client';
	
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ArrowLeft, Pencil, Save } from '@lucide/svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	
	import { Textarea } from '$lib/components/ui/textarea/index.js';



  let singleTable = $derived([
    { name: 'Name', value: data.product?.name },
    { name: 'Category', value: data.product.category },
	{ name: 'Cost Per Unit', value: data.product?.costPerUnit },
	{ name: 'Price', value: data.product?.price },
    { name: 'Available Quantity', value: data.product?.quantity },
    { name: 'Product Description', value: data.product?.description },
    { name: 'Product Commission', value: data.product?.commission },
    { name: 'Reorder Notification Quantity', value: data.product?.reorderLevel},
    { name: 'Product Supplier', value: data.product?.supplier },
    { name: 'Added On', value: data.product?.createdAt },
    { name: 'Added By', value: data.product?.createdBy },
    { name: 'Number of Sells', value: data.product?.saleCount === null ? '0 Pieces Sold': data.product?.saleCount + ' Pieces Sold'  },
    { name: 'Sales in Money', value: data.product?.paidAmount + ' Birr in Transactions'  },

  ]); 


	const { form, errors, enhance, delayed,  capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},
		validators: zod4Client(editProduct),
		resetForm: false

	});

	  $form.productName = data.product.name,
	  $form.category = data.product.categoryId,
	  $form.commission = data.product.commission,
	  $form.description = data.product.description,
	  $form.productId = data.product.id,
	  $form.costPerUnit = data.product.costPerUnit,
	  $form.quantity = data.product.quantity,
	  $form.price = data.product.price,
	  $form.reorderLevel = data.product.reorderLevel,
	  $form.supplier = data.product.supplier


	



	export const snapshot: Snapshot = { capture, restore};



	

		//   let date = $derived(dateProxy(editForm, 'appointmentDate', { format: 'date'}));



  let edit = $state(false)

  
 let search = false;
 


</script>
 <svelte:head>
        <title> Product Details</title>
 </svelte:head>


  <div class="bg-white dark:bg-black shadow-lg dark:shadow-md dark:shadow-gray-900
   rounded-md min-w-3xl w-md flex flex-col justify-center items-center">
    <div class="bg-gradient-to-r w-full from-dark to-black text-white py-6 px-8 rounded-lg flex flex-col justify-start items-start">
      <h1 class="text-center w-full">Product Details</h1>
    </div>
	<div class="flex flex-row justify-start items-start w-full pl-4 mt-4">
	<Button onclick={()=> edit = !edit}>
		{#if !edit}
		<Pencil class="w-4 h-4"/>
		 Edit
		 {:else}
		<ArrowLeft class="w-4 h-4"/>

		 Back
		 {/if}
	</Button>
	</div>
{#if edit === false}
 <div class="p-4 w-full"><SingleTable {singleTable}/></div> {/if}
 {#if edit}
 <div class="w-full p-4">
			 <form action="?/editProduct" use:enhance class="flex flex-col gap-4" id="edit" method="post">

			{@render fe('Product Name', 'productName', 'text', 'Add Product Name' , true)} 
			
			{@render selects('category', data.categories)}
			 {@render fe('Cost per unit', 'costPerUnit', 'number', "Add the cost per unit of the product" )}

			{@render fe('Price', 'price', 'number', 'Add Product Price' , true)} 
			{@render fe('Quantity', 'quantity', 'number', 'Add Product Quantity' , true)} 
			{@render fe('Commission', 'commission', 'number', 'Add Product Commision' , true)} 
			<div class="flex w-full flex-col gap-2 justify-start">
		<Label for="notes" >Product Description </Label>

        <Textarea name="description" 
         placeholder="Enter product description"			
			bind:value={$form.description}
			aria-invalid={$errors.description ? 'true' : undefined}
         />

		{#if $errors.description}<span class="text-red-500">{$errors.description}</span>{/if}
	</div>
	  {@render fe('Reorder Notify Level', 'reorderLevel', 'number', "Enter when you want to be notified" )}

			{@render fe('Supplier', 'supplier', 'text', "Enter the supplier of the product" )}
			 <input hidden name="productId" value= {data.product.id} />
			 	<Button form="edit" type="submit" class="mt-4" >  
				{#if $delayed}
					<LoadingBtn name="Saving Changes" />
				{:else}
					<Save class="h-4 w-4" />
					Save Changes
				{/if}
			</Button>


			</form>
		 </div>
		 {/if}

    </div>
	 
	




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
{#snippet selects(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}


 


		