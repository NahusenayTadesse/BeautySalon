<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	 import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";


 import ComboboxComp from "$lib/formComponents/ComboboxComp.svelte";
	import { Plus, X } from "@lucide/svelte";


  let { data } = $props()  

  
 

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
let singleContainer = `flex flex-row  gap-3 border-1
 border-white/20 dark:border-black/20 
 backdrop-blur-md shadow-lg bg-white/10
  dark:bg-gray-700 p-3 rounded-lg w-full items-end`;






	import { zod4Client } from "sveltekit-superforms/adapters";
	import { salesSchema } from "$lib/zodschemas/salesSchema";
	import { superForm } from "sveltekit-superforms/client";
	import {  fly } from "svelte/transition";
	import SuperDebug from "sveltekit-superforms";

  const { form, errors, message, enhance, delayed, capture, restore } = superForm(
		data.form,
		{
			taintedMessage: () => {
				return new Promise((resolve) => {
					resolve(window.confirm('Do you want to leave?\nChanges you made may not be saved.'));
				});
			},
      resetForm: true,

			validators: zod4Client(salesSchema)

		}
	);

  function addProduct() {
		$form.products = [...$form.products, { staff: '', product: 0, noofproducts: 1, tip: 0 }];
	}

   function addService() {
		$form.services = [...$form.services, { staff: '', service: 0, serviceTip: 0 }];
	}
  

  let checkoutTotal = $derived(
  $form.products.reduce((total, _, i) => {
    const price = getPrice(data.products, $form.products[i].product) || 0;
    const qty = $form.products[i].noofproducts || 0;
    const tip = $form.products[i].tip || 0;
    return total + price * qty + tip;
  }, 0)
);
 let checkoutTotalService = $derived(
  $form.services.reduce((total, _, i) => {
    const price = getPrice(data.services, $form.services[i].service) || 0;
    const tip = $form.services[i].serviceTip || 0;
    return total + price + tip;
  }, 0)
);

let total = $derived(checkoutTotal + checkoutTotalService);

let submitted = $state(false);

function onsubmit(){
    submitted = true;
}

</script>
<svelte:head>
   <title>Sales</title>
</svelte:head>

{submitted}
<form action="?/addSales" method="post" enctype="multipart/form-data" use:enhance {onsubmit} >

  <SuperDebug data={$form} />
  {#if $message}
      <p>{$message}</p>
  {/if} 

  {#if $errors.products}
    <p>{$errors.products._errors}</p>
   {/if}

<div class="mt-6 w-full max-w-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow p-4">

 <div class="flex flex-row gap-4">
   <Button type="button" onclick={()=> addProduct()}><Plus /> Add Product</Button>
   <Button type="button" onclick={()=> addService()}><Plus /> Add Service</Button>

 </div>
 <div class="flex flex-col gap-4 mt-6 " >  
   {#if $form.products.length}
   <h2>Products</h2>
   {/if}

{#each $form.products as value, i}
   
  <div class={singleContainer} transition:fly={{x:-200, duration: 200}}>
    {i+1}
    <div class={arrParts}>
  <Label for="staff"> Selling Staff Member</Label>
  <ComboboxComp items={data.staffes}  name="staff" bind:value={value.staff} />
  
  </div>
  <div class={arrParts}>
    
  <Label for="product"> Selling Product</Label>

  <ComboboxComp items={data.products}  name="product" bind:value={value.product} />

  </div>
    <div class={arrParts}>
        <Label for="noofproducts"> Number of Product</Label>

   <Input type="number" min="1" name="noofproducts" bind:value={value.noofproducts}/>
   </div>
      <div class={arrParts}>
        <Label for="tip"> Tip</Label>

   <Input type="number" name="tip" bind:value={value.tip}/>
   </div>

  <Button type="button" variant="outline"
   title="Remove this product from list"
   onclick={()=>
     {$form.products.splice(i, 1);
      $form.products = $form.products;
     }
   }
   >
    <X class="w-8 h-8"  /> 

  </Button>



  </div>

   
 {/each}

 {#if $form.services.length}
   <h2>Services</h2>
   {/if}

 {#each $form.services as value, i}
  <div class={singleContainer} transition:fly={{x:-200, duration: 200}}>
    {i+1}
<div class={arrParts}>
    
    <Label for="staff">Service Provider</Label>
  

    <ComboboxComp items={data.staffes}  name="staff" bind:value={value.staff} />
</div>
<div class={arrParts}>
   <Label for="staff"> Service</Label>

  <ComboboxComp items={data.services}  name="service" bind:value={value.service} />
  </div>  
    <div class={arrParts}>
        <Label for="serviceTip"> Tip</Label>

   <Input type="number" name="serviceTip" bind:value={value.serviceTip}/> 

   </div>

   <Button type="button" variant="outline"
   title="Remove this service from list" 
    onclick={
       ()=>{
        $form.services.splice(i,1);
        $form.services = $form.services;
       }
    }
   
   > 
    <X class="w-8 h-8"  /> 

  </Button>
  </div>
   
 {/each}
 </div>




  <div class="flex items-center justify-between mb-2 mt-8">
    <h3 class="text-lg font-medium text-slate-700 dark:text-slate-100">Transaction summary</h3>
    <span class="text-sm text-slate-500 dark:text-slate-400">{$form.products.length} products · {$form.services.length} services</span>
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

