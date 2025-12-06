<script lang='ts'>
	
  

  let { data } = $props();


	

	import DataTable from '$lib/components/Table/data-table.svelte';
	import { boughtSupplies, soldProduct, soldServices } from './columns.js';
	import SingleTable from '$lib/components/SingleTable.svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Download, Eye } from '@lucide/svelte';

let singleTable = $derived([
    { name: 'Date', value: data.singleTransaction?.date },
    { name: 'Amount', value: 'ETB ' + data.singleTransaction?.amount  },
    { name: 'Payment Method', value: data.singleTransaction?.paymentMethods},
    { name: 'No of Products', value: data.singleTransaction?.noOfProducts},
    { name: 'No of Services', value: data.singleTransaction?.noOfServices},
    { name: 'No of Supplies', value: data.singleTransaction?.noOfSupplies},
    { name: 'Recieved By', value: data.singleTransaction?.recievedBy},

  ]); 

   
	



</script>
 <svelte:head>
        <title> Transaction Details</title>
 </svelte:head>
  <div class="bg-white dark:bg-black shadow-lg dark:shadow-md dark:shadow-gray-900
   rounded-md min-w-3xl w-md flex flex-col justify-center items-center">
    <div class="bg-gradient-to-r w-full from-dark to-black text-white py-6 px-8 rounded-lg flex flex-col justify-start items-start">
      <h1 class="text-center w-full">Transaction Details</h1>
	  
    </div>
	<div class="flex flex-row justify-start items-start w-full pl-4 mt-4">

	
	 
    <div class="p-4 w-full"><SingleTable {singleTable}/>
	  <div class="flex flex-row gap-2 w-full justify-end">

		<Button href="/dashboard/files/{data.singleTransaction.recieptLink}" target="_blank" >

	<Eye />
	  View Reciept
	</Button>
		<Button href="/dashboard/files/{data.singleTransaction.recieptLink}" download="Transaction Reciept" >

	<Download />
	  Download Reciept
	</Button> 

	   
	  </div>
		</div> 
  
	</div>

</div> 


	 
	<div class="lg:w-1/2 w-4/5 my-8"> 


	   {#if data.soldProducts.length || data.soldServices.length}
		<div class="mb-6">
			<h3 class="text-lg font-semibold">Products</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Product sold in this Transactions.</p>
			<DataTable data={data.soldProducts} columns={soldProduct} search={false} />
		</div>

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Services</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Rendered Services in this Transaction.</p>
			<DataTable data={data.soldServices} columns={soldServices} search={false} />
			
		</div>
		{/if}

		{#if data.boughtSupplies.length}

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Supplies</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Supplies Bought in this Transactions.</p>
			<DataTable data={data.boughtSupplies} columns={boughtSupplies} search={false} />
		</div>
		{/if}

		

	</div>


 




 


		