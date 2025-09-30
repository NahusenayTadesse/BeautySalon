<script lang='ts'>
    import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
    import { bookingFeeSchema } from '$lib/zodschemas/appointmentSchema';
  

  let { data } = $props();

   import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { superForm } from 'sveltekit-superforms/client';
	import ComboboxComp from '$lib/formComponents/ComboboxComp.svelte';

  let singleTable = [
    { name: 'Name', value: data.appointmentsList.customerName },
    { name: 'Phone', value: data.appointmentsList.phone },
    { name: 'Booked By', value: data.appointmentsList.bookedBy },
    { name: 'Status', value: data.appointmentsList.status },
    { name: 'Date', value: data.appointmentsList.date },
    { name: 'Time', value: data.appointmentsList.time },
    { name: 'Notes', value: data.appointmentsList.notes },
    { name: 'Booked At', value: data.appointmentsList.bookedAt }
  ]; 


	const { form, errors, enhance, delayed,  capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},
		validators: zod4Client(bookingFeeSchema)

	});

   
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

    <form use:enhance method="post" enctype="multipart/form-data" 
    class="p-4 border rounded-md w-full flex flex-col gap-4" action="?/confirmAppointment">
	 

    {@render fe('Booking Fee Amount', 'amount', 'number', 'Enter The Amount Booking Fee in Birr', true, "0")}
	 <input type="hidden" name="appointmentId" value={data.appointmentsList.id} >
	{@render combo("paymentMethod", data.allMethods)}
    {@render fe('Upload Reciept or Screenshot of Booking Fee', 'image', 'file', 'Enter Name', true)}
    <Button type="submit">Submit</Button>

    </form>


  </Card.Content>
  </Card.Root>