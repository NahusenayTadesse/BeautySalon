import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { serviceSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {  services } from '$lib/server/db/schema.js';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(serviceSchema));

  return {
    form
  };
};

export const actions: Actions = {
  addProduct: async ({ request }) => {
    const form = await superValidate(request, zod4(serviceSchema));

    if (!form.valid) {
      return fail(400, {
        form
      });
    }


        const { serviceName, description, durationMinutes, price } = form.data;

    
    try{
     await db.insert(services).values({serviceName, description, durationMinutes, price});
     


    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};