  
  <script lang='ts'>
    import { columns } from "./columns";
  

  let { data } = $props();

  import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from "$lib/components/Loading.svelte";
	import { Frown } from "@lucide/svelte";
	import DateMonth from "$lib/formComponents/DateMonth.svelte";

  
   
   
</script>

<svelte:head>
        <title> Transactions </title>
</svelte:head>
  

 {#await data}
  
  <Loading  name="Transactions"/>
 {:then reports} 

  {#if data.allReports.length === 0}
   <div class="w-5xl h-96 flex flex-col justify-center items-center">
   <p class="text-center flex flex-row gap-4 mt-4 text-4xl justify-self-cente"><Frown class="animate-bounce w-16  h-12" />


     Transactions is Empty for this Date Range Choose Another Range</p>
   <DateMonth start={data?.start} end={data?.end} link="/dashboard/transactions/ranges"  />


     </div>
 {:else}
     <h2 class="text-2xl my-4">No of Transactions {data.allReports?.length} </h2>

     <DateMonth start={data?.start} end={data?.end} link="/dashboard/transactions/ranges"  />

 <div class="lg:w-[1250px] w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4 px-2">
   

   <DataTable data={data.allReports} {columns}  />
 </div>
 {/if}
  {:catch}

    <div class="w-screen h-screen flex flex-col justify-center items-center"> 
         <h1 class="text-red-500">Unexpected Error: Reload</h1>
    </div>
  {/await}


  
