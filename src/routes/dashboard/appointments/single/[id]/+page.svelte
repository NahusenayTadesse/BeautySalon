<script lang='ts'>
    import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { zod4Client } from 'sveltekit-superforms/adapters';
    import { bookingFeeSchema } from '$lib/zodschemas/appointmentSchema';
	import { editAppointment } from '$lib/ZodSchema';
	import { columns } from './columns';
  

  let { data } = $props();

   import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { fileProxy, superForm } from 'sveltekit-superforms/client';
	import ComboboxComp from '$lib/formComponents/ComboboxComp.svelte';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { ArrowLeft, Frown, Pencil, Plus, Save, Trash, Upload, X } from '@lucide/svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';
	import type { Snapshot } from '@sveltejs/kit';
	import DataTable from '$lib/components/Table/data-table.svelte';
	
	import DatePicker2 from '$lib/formComponents/DatePicker2.svelte';
	import Delete from '$lib/forms/Delete.svelte';
	import Empty from '$lib/components/Empty.svelte';

  let singleTable = $derived([
    { name: 'Name', value: data.appointmentsList.customerName },
    { name: 'Phone', value: data.appointmentsList.phone },
    { name: 'Booked By', value: data.appointmentsList.bookedBy },
    { name: 'Status', value: data.appointmentsList.status },
    { name: 'Date', value: data.appointmentsList.date },
    { name: 'Time', value: data.appointmentsList.time },
    { name: 'Notes', value: data.appointmentsList.notes },
    { name: 'Booked At', value: data.appointmentsList.bookedAt },
    { name: 'Paid Amount', value: data.appointmentsList.paidAmount }

  ]); 


	const { form, errors, enhance, delayed,  capture, restore } = superForm(data.form, {
		taintedMessage: () => {
			return new Promise((resolve) => {
				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
			});
		},
		validators: zod4Client(bookingFeeSchema)

	});

	const { form: editForm, errors: editErrors, enhance:editEnhance, delayed:editDelayed } = superForm(data. editForm, {
	
		validators: zod4Client(editAppointment),
		multipleSubmits: 'allow',
		resetForm: false

	});


	export const snapshot: Snapshot = { capture, restore};
	  const file = fileProxy(form, 'image');


	  const paymentStatus = [
		 { value: 'paid', name: 'Full Payment'},
		 { value: 'partially_paid', name: 'Partial Payment'}, 
	  ];

 
 $editForm.customerId = Number(data.appointmentsList.customerId)
 $editForm.appointmentDate = data.appointmentsList.date;
 $editForm.appointmentTime = data.appointmentsList.time;
 $editForm.notes = data.appointmentsList.notes || undefined;



		//   let date = $derived(dateProxy(editForm, 'appointmentDate', { format: 'date'}));



  let edit = $state(false)

  
 let search = false;

 let date = new Date();

 let redirect = `/dashboard/appointments/${date.toLocaleDateString("en-CA")}`;
 


</script>
 <svelte:head>
        <title> Appointment Details</title>
 </svelte:head>

 {#if data.appointmentsList.customerName}

  
  <div class="bg-white dark:bg-black shadow-lg dark:shadow-md dark:shadow-gray-900
   rounded-md lg:w-md w-full flex flex-col justify-center items-center">
    <div class="bg-gradient-to-r  from-dark to-black text-white py-6 px-8 rounded-lg flex flex-col justify-start items-start">
      <h1 class="text-center">Appointment Details</h1>
    </div>
	<div class="flex flex-row justify-start items-start w-full pl-4 mt-4 gap-2">
	<Button onclick={()=> edit = !edit}>
		{#if !edit}
		<Pencil class="w-4 h-4"/>
		 Edit
		 {:else}
		<ArrowLeft class="w-4 h-4"/>

		 Back
		 {/if}
	</Button>
	<Delete  {redirect} />
	 
	</div>
{#if edit === false}
 <div class="p-4 w-full"><SingleTable {singleTable}/></div> {/if}
 {#if edit}
 <div class="w-full p-4">
			 <form action="?/editAppointment" use:editEnhance class="flex flex-col gap-4" id="edit" method="post">
			 {@render combo2('customerId', data.customersList )}
      
        <DatePicker2  bind:data={$editForm.appointmentDate} />
		<input type="hidden" name="appointmentDate" bind:value={$editForm.appointmentDate} id="">

	{#if $editErrors.appointmentDate}
			<span class="text-red-500">{$editErrors.appointmentDate}</span>
		{/if}

			{@render fe2('Appointment Time', 'appointmentTime', 'time', '', true)} 
			{@render fe2('Notes', 'notes', 'text', '')} 
			 <input hidden name="appointmentId" value= {data.appointmentsList.id} />
			 	<Button form="edit" type="submit" class="mt-4" >  
				{#if $editDelayed}
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
	 {#if data.reciepts?.length}
	 	  <div class="bg-white dark:bg-black shadow-lg dark:shadow-md dark:shadow-gray-900
   rounded-md w-full flex flex-col justify-center items-start mt-4">
    <div class="bg-gradient-to-r lg:w-8/10 w-full from-dark to-black text-white py-6 px-8 rounded-lg flex flex-col justify-center items-start">
      <h1 class="text-start"> Booking Fee Paids </h1>
	  	 </div>

	<div class="flex flex-col mt-4 lg:w-8/10 w-full">
		<DataTable data={data.reciepts} {columns} {search}  />
        <Button size="lg" class="w-lg" href="/dashboard/sales/appointments/{data.appointmentsList.id}"> <Plus /> Add Sales for Customer</Button>
	 </div>

	     

        
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


   {#snippet fe2(
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
			bind:value={$editForm[name]}
			aria-invalid={$editErrors[name] ? 'true' : undefined}
		/>
		{#if $editErrors[name]}
			<span class="text-red-500">{$editErrors[name]}</span>
		{/if}
	</div>
{/snippet}

{#snippet combo2(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, "$1 $2")}:</Label>

		<ComboboxComp {name} bind:value={$editForm[name]} {items} />
		{#if $editErrors[name]}<span class="text-red-500">{$editErrors[name]}</span>{/if}
	</div>
{/snippet} 



		<Card.Root class="flex lg:w-xl w-full mt-8 flex-col gap-4">
	<Card.Header class="mb-4">
		<Card.Title class="text-2xl text-center">Confirm Appointment</Card.Title>
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
	 <div class="relative flex flex-row gap-2">
	 <Upload class="h-6 w-6 absolute top-2 bottom-0.5 right-16" />
	 <Input type="file" name="image"
	 accept="image/*,application/pdf" bind:files={$file} multiple={false} /> <Button type="button" size="icon" variant="outline" title="Clear file input" onclick={() => $file = 0}>  <X /> </Button>
	 </div>
	 {#if $errors.image} <span class="text-red-500">{$errors.image}</span> {/if}
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

  {:else} 

 <Empty title="appointments" />

  {/if}