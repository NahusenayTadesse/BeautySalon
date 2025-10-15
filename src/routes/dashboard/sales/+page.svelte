<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	 import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";


 import ComboboxComp from "$lib/formComponents/ComboboxComp.svelte";
  // Number of inputs
  let productCount = $state(0);
  let serviceCount = $state(0);
  let { data } = $props()  // Array to hold input values

   let productArr = $derived(Array(productCount));
   let serviceArr = $derived(Array(serviceCount));
   let product = $state(0)
   let service = $state(0)
   let staff = $state(0)

   function getName(List: Array<{value: number; name: string}>, value: number) {
  const single = List.find(s => s.value === value);
  return single ? single.name : null;
}
  function getPrice(
  List: Array<{ value: number; name: string; price: string }>,
  value: number
): number | null {
  const item = List.find(s => s.value === value);
  return item ? Number(item.price) : null;
}


let arrParts = `flex flex-col justify-start gap-2 w-full`
</script>

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
			
		/>
		
	</div>
{/snippet}

 <div class="flex flex-row gap-4">
   <Button onclick={()=>productCount++}>Add Product</Button>
   <Button onclick={()=>serviceCount++}>Add Service</Button>

 </div>
 <div class="flex flex-col gap-4 mt-6 w-full">

{#each productArr as value, i}
  <div class="flex flex-row gap-2">
    <div class={arrParts}>
  <Label for="staff"> Selling Staff Member</Label>
  <ComboboxComp items={data.staffes}  name="staff" bind:value={staff} />
  </div>
  <div class={arrParts}>
    
  <Label for="product"> Selling Product</Label>

  <ComboboxComp items={data.products}  name="product" bind:value={product} />
  </div>
    
  {@render fe('Number of Products', 'product', 'number')}
 

  </div>
   
 {/each}

 {#each serviceArr as value, i}
  <div class="flex flex-row gap-2 w-full">
<div class={arrParts}>
    <Label for="staff">Staff Member Who Rendered Service</Label>
  

    <ComboboxComp items={data.staffes}  name="staff" bind:value={staff} />
</div>
<div class={arrParts}>
   <Label for="staff"> Service</Label>

  <ComboboxComp items={data.services}  name="service" bind:value={service} />
  </div>  



  </div>
   
 {/each}
 </div>

 {getPrice(data.products, product)}


