<script lang="ts">
	import { Input } from "$lib/components/ui/input";


 import ComboboxComp from "$lib/formComponents/ComboboxComp.svelte";
  // Number of inputs
  let count = $state(1);
  let { data } = $props()  // Array to hold input values

   let arr = $derived(Array(count));
   let product = $state(0)
   let service = $state(0)
   
</script>

<label>
    Number of inputs:
    <input type="number" min="1" bind:value={count} />
</label>

{#each arr as value, i}
  <div class="flex flex-row gap-2 w-1/2">
 
  <ComboboxComp items={data.products}  name="product" bind:value={product} />
  <ComboboxComp items={data.services}  name="service" bind:value={service} />
    
  <Input type="number" min="1"  > </Input>
     <input type="text" value={product} />


  </div>
   
 {/each}