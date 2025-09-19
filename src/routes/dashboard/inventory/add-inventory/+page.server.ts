import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { inventoryItemSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { products as inventory } from '$lib/server/db/schema.js';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';


export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(inventoryItemSchema));

  return {
    form
  };
};

export const actions: Actions = {
  addProduct: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(inventoryItemSchema));

    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      return fail(400, { form });
    }


        const { productName, description, quantity, price, supplier } = form.data;

    
    try{
     await db.insert(inventory).values({productName, description, quantity, price, supplier});

 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "New Inventory Successuflly Added" }, cookies);
    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};