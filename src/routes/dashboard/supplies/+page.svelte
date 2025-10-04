  
  <script lang='ts'>
    import { columns } from "./columns";
  

  let { data } = $props();

  import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from "$lib/components/Loading.svelte";
	import { Frown, Plus } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";

  
   
   
</script>

<svelte:head>
        <title> Products List</title>
</svelte:head>
  

 {#await data}
  
  <Loading  name="Customers"/>
 {:then customerList} 

  {#if data.supplyList.length === 0}
   <div class="w-5xl h-96 flex flex-col gap-4 justify-center items-center">
   <p class="text-center flex flex-row gap-4 mt-4 text-4xl justify-self-center">
    
    <Frown class="animate-bounce w-16  h-12" />
     No supplies added Yet</p>
     <Button href="/dashboard/supplies/add-supplies"><Plus /> Add New Supplies</Button>
     </div>
 {:else}
     <h2 class="text-2xl my-4">No of Supplies: {data.supplyList?.length} </h2>

 <div class="lg:w-full w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.supplyList} {columns} />
 </div>
 {/if}
  {:catch}

    <div class="w-screen h-screen flex flex-col justify-center items-center"> 
         <h1 class="text-red-500">Unexpected Error: Reload</h1>
    </div>
  {/await}
