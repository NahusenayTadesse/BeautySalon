<script lang='ts'>
    import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
    import { bookingFeeSchema } from '$lib/zodschemas/appointmentSchema';
	import { columns } from './columns';
  

  let { data } = $props();

   import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { fileProxy, superForm } from 'sveltekit-superforms/client';
	import ComboboxComp from '$lib/formComponents/ComboboxComp.svelte';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { Plus } from '@lucide/svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import DataTable from '$lib/components/Table/data-table.svelte';

  let singleTable = $derived([
    { name: 'Name', value: data.appointmentsList.customerName },
    { name: 'Phone', value: data.appointmentsList.phone },
    { name: 'Booked By', value: data.appointmentsList.bookedBy },
    { name: 'Status', value: data.appointmentsList.status },
    { name: 'Date', value: data.appointmentsList.date },
    { name: 'Time', value: data.appointmentsList.time },
    { name: 'Notes', value: data.appointmentsList.notes },
    { name: 'Booked At', value: data.appointmentsList.bookedAt },
    { name: 'Reciept Link', value: data.appointmentsList.recieptLink }

  ]); 


	const { form, errors, enhance, delayed,  capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},
		validators: zod4Client(bookingFeeSchema)

	});


	export const snapshot: Snapshot = { capture, restore};
	  const file = fileProxy(form, 'image');


	  const paymentStatus = [
		 { value: 'paid', name: 'Full Payment'},
		 { value: 'partially_paid', name: 'Partial Payment'}, 
	  ]


   
</script>
 <svelte:head>
        <title> Appointment Details</title>
 </svelte:head>


  <div class="bg-white dark:bg-black shadow-lg dark:shadow-md dark:shadow-gray-900
   rounded-md min-w-3xl w-md flex flex-col justify-center items-center">
    <div class="bg-gradient-to-r w-full from-dark to-black text-white py-6 px-8 rounded-lg flex flex-col justify-center items-center">
      <h1 class="text-center">Appointment Details</h1>
    </div>
 <div class="p-4 w-full"><SingleTable {singleTable}/></div>
     
    </div>
	{data.reciepts?.length}
	 {#if data.reciepts?.length}
	<div class="flex flex-col mt-4">
		<DataTable data={data.reciepts} {columns} />
          
	 </div>
	 {/if}
	




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

{#snippet combo(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, "$1 $2")}:</Label>

		<ComboboxComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet} 




		<Card.Root class="flex w-xl mt-8 flex-col gap-4">
	<Card.Header class="mb-4">
		<Card.Title class="text-2xl text-center">Add An Appointment</Card.Title>
		<Card.Description class="text-center">Add New Appointments to track the how many have</Card.Description>
	</Card.Header>
	<Card.Content>

    <form use:enhance method="post"  enctype="multipart/form-data" 
    class="p-4 border rounded-md w-full flex flex-col gap-4" action="?/confirmAppointment">
	 

    {@render fe('Booking Fee Amount', 'amount', 'number', 'Enter The Amount Booking Fee in Birr', true, "0")}
	 <input type="hidden" name="appointmentId" value={data.appointmentsList.id} >
	{@render combo("paymentMethod", data.allMethods)}
	{@render selects('paymentStatus', paymentStatus)}
	 <div class="flex w-full flex-col justify-start gap-2">
	 <Label for='image' class="capitalize">Upload Reciept or Screenshot of Booking Fee</Label>
	 <Input type="file" name="image"
	 accept="image/*,application/pdf" bind:files={$file} multiple={false} />
	 {#if $errors.image} <span>{$errors.image}</span> {/if}
	 </div>	
    <!-- {@render fe('Upload Reciept or Screenshot of Booking Fee', 'image', 'file', 'Enter Name', true)} -->

	 
	<Button type="submit" class="mt-4" >  
				{#if $delayed}
					<LoadingBtn name="Confirming Appointment" />
				{:else}
					<Plus class="h-4 w-4" />
					Confirm Appointment
				{/if}
			</Button>

  
    </form>




  </Card.Content>
  </Card.Root>