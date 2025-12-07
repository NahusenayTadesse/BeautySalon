  
  <script lang='ts'>
    import { columns } from "./columns";
  

  let { data } = $props();

  import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from "$lib/components/Loading.svelte";
	import { Frown, ArrowRight } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import MonthYear from "$lib/formComponents/MonthYear.svelte";

  
   
   let year = $state(new Date().getFullYear());
let month = $state(
  new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toLocaleDateString(undefined, { month: 'long' })
);

  let link = $derived(`${month}_${year}`)
</script>

<svelte:head>
        <title> Salaries List for {data.month} {data.year}</title>
</svelte:head>
  


 {#await data}
  
  <Loading  name="Salaries"/>
 {:then payrollData} 

  {#if data?.payrollData.length === 0}
   <div class="w-5xl h-96 flex flex-col justify-center items-center">
   <p class="text-center flex flex-row gap-4 mt-4 text-4xl justify-self-cente"><Frown class="animate-bounce w-16  h-12" />
     No salaries  or staff data added yet for {data.month} {data.year} </p>
     <!-- <Button href="/dashboard/services/add-services"><Plus />Add New Staff Members</Button> -->

     </div>
 {:else}
    <div class="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm rounded-lg p-4 lg:flex lg:items-center lg:justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-lg lg:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Salaries — {data.month} {data.year}
        </h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Total staff: <span class="font-medium text-gray-800 dark:text-gray-100">{data?.payrollData.length}</span>
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-3 sm:mt-0">
        <div class="flex gap-2 items-center">
          <label class="sr-only" for="month-select">Month</label>
          <MonthYear bind:value={month} mode="month" id="month-select" />
          <label class="sr-only" for="year-select">Year</label>
          <MonthYear bind:value={year} mode="year" id="year-select" />
        </div>

        <Button href={`/dashboard/salary/${link}`} aria-label="Go to selected month and year" class="flex items-center gap-2">
          Go
          <ArrowRight class="w-4 h-4" />
        </Button>
      </div>
    </div>

 <div class="lg:w-full w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.payrollData} {columns}  />
 </div>
 {/if}
  {:catch}

    <div class="w-screen h-screen flex flex-col justify-center items-center"> 
         <h1 class="text-red-500">Unexpected Error: Reload</h1>
    </div>
  {/await}
 

