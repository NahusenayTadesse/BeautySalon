<script lang='ts'>
	
  

  let { data } = $props();


	

	import DataTable from '$lib/components/Table/data-table.svelte';
	import { soldProduct, soldServices } from './columns.js';





</script>
 <svelte:head>
        <title> Transaction Details</title>
 </svelte:head>

	 
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


 




 


		