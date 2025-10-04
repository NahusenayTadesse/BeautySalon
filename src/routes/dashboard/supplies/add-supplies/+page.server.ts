import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { supplyItemSchema as schema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { supplies as inventory } from '$lib/server/db/schema/';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';


export const load: PageServerLoad = async () => {

     
  const form = await superValidate(zod4(schema));

  return {
    form
  };
};

export const actions: Actions = {
  addProduct: async ({ request, cookies, locals }) => {
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      return fail(400, { form });
    }


        const { supplyName, description, unitOfMeasure, quantity, supplier, reorderLevel, costPerUnit } = form.data;

    
    try{
     await db.insert(inventory).values({name: supplyName, description,
       unitOfMeasure,
       quantity, costPerUnit, supplier, reorderLevel,
        branchId: locals?.user?.branch,
        createdBy: locals?.user?.id
    });

 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "New Supply Successuflly Added" }, cookies);
    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};