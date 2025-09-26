import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq, and } from "drizzle-orm"

import { inventoryItemSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { products, customers } from '$lib/server/db/schema/';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';


export const load: PageServerLoad = async ({locals}) => {
  const form = await superValidate(zod4(inventoryItemSchema));
  const customersList = await db.select({
  id: customers.id,
  firstName: customers.firstName,
  lastName: customers.lastName,
  phone: customers.phone
})
.from(customers)
.where(
  and(
    eq(customers.isActive, true),
    eq(customers.branchId, locals?.user?.branch)
  )
);

const productsList = await db.select({

    value: products.id,
    name: products.name,
})

  return {
    form, 
    customersList,
    productsList
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



    
    try{

 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "New Inventory Successuflly Added" }, cookies);
    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};