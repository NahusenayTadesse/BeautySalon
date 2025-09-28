<script lang='ts'>
	import { enhance } from '$app/forms';
    import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

  

  let { form, data } = $props();

   import SingleTable from '$lib/components/SingleTable.svelte';
	import SelectComp from '$lib/formComponents/SelectComp.svelte';

  let singleTable = [
    { name: 'Name', value: data.appointmentsList.customerName },
    { name: 'Phone', value: data.appointmentsList.phone },
    { name: 'Booked By', value: data.appointmentsList.bookedBy },
    { name: 'Date', value: data.appointmentsList.date },
    { name: 'Time', value: data.appointmentsList.time },
    { name: 'Notes', value: data.appointmentsList.notes },
    { name: 'Booked At', value: data.appointmentsList.bookedAt }
  ]; 

   
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
{#snippet selects(name, items)}
	<div class="flex w-full flex-col justify-start gap-2">
		<Label for={name} class="capitalize">{name.replace(/([a-z])([A-Z])/g, '$1 $2')}:</Label>

		<SelectComp {name} bind:value={$form[name]} {items} />
		{#if $errors[name]}<span class="text-red-500">{$errors[name]}</span>{/if}
	</div>
{/snippet}

    <form use:enhance method="post" enctype="multipart/form-data" class="mt-8 p-4 border rounded-md w-md" action="?/confirmAppointment">
        <label for="image" class="block mb-2 font-medium text-gray-700 dark:text-gray-300">Upload Document:</label>
        <input type="file" name="image" id="image" class="block w-full text-sm text-gray-500
         file:mr-4 file:py-2 file:px-4
         file:rounded-full file:border-0
         file:text-sm file:font-semibold
         file:bg-violet-50 file:text-violet-700
         hover:file:bg-violet-100
         dark:file:bg-gray-700 dark:file:text-gray-200
         dark:hover:file:bg-gray-600
         "/>
        <button type="submit" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit</button>
    </form>
    {#if form?.success}
      <p class="text-green-600 mt-4">Document uploaded successfully! File path: <a href="/dashboard/files/{form?.path}">{form?.path}</a></p>
    {/if}