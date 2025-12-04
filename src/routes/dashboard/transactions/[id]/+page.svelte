<script lang='ts'>
	
  

  let { data } = $props();


	

	import DataTable from '$lib/components/Table/data-table.svelte';
	import { soldProduct, soldServices } from './columns.js';
	import SingleTable from '$lib/components/SingleTable.svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Download } from '@lucide/svelte';

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

	
	 
    <div class="p-4 w-full"><SingleTable {singleTable}/><Button href="/dashboard/files/{data.singleTransaction.recieptLink}" download="Transaction Reciept" >

	<Download />
	  Download Reciept
	</Button></div> 
  
	</div>

</div> 


	 
	<div class="lg:w-1/2 w-4/5 my-8"> 


	
		<div class="mb-6">
			<h3 class="text-lg font-semibold">Products</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Commissions earned from product sales by {data?.staffMember?.firstName} {data?.staffMember?.lastName}.</p>
			<DataTable data={data.soldProducts} columns={soldProduct} search={false} />
		</div>

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Services</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Commissions earned from services performed by {data?.staffMember?.firstName} {data?.staffMember?.lastName}.</p>
			<DataTable data={data.soldServices} columns={soldServices} search={false} />
			
		</div>

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Overtime Records</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Logged overtime shifts and corresponding pay.</p>
			<DataTable data={data.soldProducts} columns={soldProduct} search={false} />
		</div>

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Deductions</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Salary deductions applied to {data?.staffMember?.firstName} {data?.staffMember?.lastName}.</p>
			<DataTable data={data.soldProducts} columns={soldProduct} search={false} />
		</div>

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Bonuses</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Bonuses awarded to {data?.staffMember?.firstName} {data?.staffMember?.lastName}.</p>
			<DataTable data={data.soldProducts} columns={soldProduct} search={false} />
		</div>
		

	</div>


 




 


		