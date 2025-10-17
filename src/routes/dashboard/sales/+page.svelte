<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	 import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";


 import ComboboxComp from "$lib/formComponents/ComboboxComp.svelte";
	import { X } from "@lucide/svelte";
  // Number of inputs
   let productArr = $state(Array([0]));
  let productCount = $derived(productArr.length);
  let serviceCount = $state(1);
     let serviceArr = $state(Array([0]));

  let { data } = $props()  // Array to hold input values

  
   let product = $state([0])
   let service = $state([0])
   let staff = $state(0);
   let amount = $state([1]);
   let tips = $state([0]);
   let serviceTips = $state([0]);

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


 

let arrParts = `flex flex-col justify-start gap-2 w-full`;


let checkoutTotal = $derived(
  productArr.reduce((total, _, i) => {
    const price = getPrice(data.products, product[i]) || 0;
    const qty = amount[i] || 0;
    const tip = tips[i] || 0;
    return total + price * qty + tip;
  }, 0)
);
 let checkoutTotalService = $derived(
  productArr.reduce((total, _, i) => {
    const price = getPrice(data.services, service[i]) || 0;
    const tip = serviceTips[i] || 0;
    return total + price + tip;
  }, 0)
);


let total = $derived(checkoutTotal + checkoutTotalService);

	// import { zod4Client } from "sveltekit-superforms/adapters";
	// import { inventoryItemSchema } from "$lib/ZodSchema";
	// import { superForm } from "sveltekit-superforms/client";

  // const { form, errors, enhance, delayed, capture, restore } = superForm(
	// 	data.form,
	// 	{
	// 		taintedMessage: () => {
	// 			return new Promise((resolve) => {
	// 				resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
	// 			});
	// 		},

	// 		validators: zod4Client(inventoryItemSchema)

	// 	}
	// );


</script>
<svelte:head>
   <title>Sales</title>
</svelte:head>
<form action="?/addSales" method="post" enctype="multipart/form-data" >

<div class="mt-6 w-full max-w-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow p-4">

 <div class="flex flex-row gap-4">
   <Button type="button" onclick={()=>{productArr.push([productArr.length]); amount.push(1); tips.push(0)}}>Add Product</Button>
   <Button type="button" onclick={()=>serviceArr.push([serviceArr.length])}>Add Service</Button>

 </div>
 <div class="flex flex-col gap-4 mt-6 " >

{#each productArr as value, i}
  <div class="flex flex-row gap-2 items-end">
    
    <div class={arrParts}>
  <Label for="staff"> Selling Staff Member</Label>
  <ComboboxComp items={data.staffes}  name="staff" bind:value={staff} />
  </div>
  <div class={arrParts}>
    
  <Label for="product"> Selling Product</Label>

  <ComboboxComp items={data.products}  name="product" bind:value={product[i]} />
  </div>
    <div class={arrParts}>
        <Label for="noofproducts"> Number of Product</Label>

   <Input type="number" min="1" name="noofproducts" bind:value={amount[i]}/>
   </div>
      <div class={arrParts}>
        <Label for="tip"> Tip</Label>

   <Input type="number" name="tips" bind:value={tips}/>
   </div>

  <Button type="button" variant="outline"
   title="Remove this product from list"
   onclick={()=>
     {productArr.splice(i, 1);
      amount.splice(i,1);
      tips.splice(i,1);


     }
   }
   >
    <X class="w-8 h-8"  /> 

  </Button>



  </div>

   
 {/each}

 {#each serviceArr as value, i}
  <div class="flex flex-row gap-2 w-full items-end">
<div class={arrParts}>
    <Label for="staff">Service Provider</Label>
  

    <ComboboxComp items={data.staffes}  name="staff" bind:value={staff} />
</div>
<div class={arrParts}>
   <Label for="staff"> Service</Label>

  <ComboboxComp items={data.services}  name="service" bind:value={service[i]} />
  </div>  
    <div class={arrParts}>
        <Label for="serviceTip"> Tip</Label>

   <Input type="number" name="serviceTip" bind:value={serviceTips[i]}/>
   </div>

   <Button type="button" variant="outline"
   title="Remove this service from list"
   onclick={()=>
     {serviceArr.splice(i, 1);
      service.splice(i,1);
      serviceTips.splice(i, 1);
    


     }
   }
   > {i}
    <X class="w-8 h-8"  /> 

  </Button>
  </div>
   
 {/each}
 </div>




  <div class="flex items-center justify-between mb-2 mt-8">
    <h3 class="text-lg font-medium text-slate-700 dark:text-slate-100">Transaction summary</h3>
    <span class="text-sm text-slate-500 dark:text-slate-400">{productArr.length} products · {serviceArr.length} services</span>
  </div>

  <div class="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
    <div class="flex flex-col">
      <span class="uppercase text-xs tracking-wide text-slate-400">Products</span>
      <span class="mt-1 text-base font-semibold text-slate-800 dark:text-slate-50">ETB
        {checkoutTotal ? Number(checkoutTotal).toFixed(2) : '0.00'}
      </span>
    </div>

    <div class="flex flex-col">
      <span class="uppercase text-xs tracking-wide text-slate-400">Services</span>
      <span class="mt-1 text-base font-semibold text-slate-800 dark:text-slate-50">ETB
        {checkoutTotalService ? Number(checkoutTotalService).toFixed(2) : '0.00'}
      </span>
    </div>
  </div>

  <div class="mt-4 border-t border-slate-100 dark:border-slate-700 pt-3 flex items-baseline justify-between">
    <span class="text-lg text-gray-900 dark:text-white">Grand Total</span>
    <span class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">ETB
      {total ? Number(total).toFixed(2) : '0.00'}
    </span>
  </div>

  <div class="mt-3 flex gap-2">
    <Button type="submit">Save Sale</Button>
    <Button variant="outline" type="reset" >Reset</Button>
  </div>
</div>

</form>

