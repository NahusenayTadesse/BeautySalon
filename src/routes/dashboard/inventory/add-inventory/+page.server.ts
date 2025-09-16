import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { inventoryItemSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { inventory } from '$lib/server/db/schema.js';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(inventoryItemSchema));

  return {
    form
  };
};

export const actions: Actions = {
  addProduct: async ({ request }) => {
    const form = await superValidate(request, zod4(inventoryItemSchema));

    if (!form.valid) {
      return fail(400, {
        form
      });
    }


        const { productName, description, quantity, price, supplier } = form.data;

    
    try{
     await db.insert(inventory).values({productName, description, quantity, price, supplier});
     


    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};