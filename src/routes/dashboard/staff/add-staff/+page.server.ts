import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { staffSchema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { positions, staff } from '$lib/server/db/schema/';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(staffSchema));

  const allPositions = await db.select({
      value: positions.id,
      name: positions.name
  }).from(positions);

  const allStaff = await db.select({
       name: staff.firstName,
  }).from(staff)

  return {
    form,
    allPositions,
    allStaff
  };
};

export const actions: Actions = {
  addProduct: async ({ request }) => {
    const form = await superValidate(request, zod4(staffSchema));

    if (!form.valid) {
      return fail(400, {
        form
      });
    }


const { 
  firstName, 
  lastName, 
  email, 
  phone, 
  position 
} = form.data;

    
    try{
     await db.insert(staff).values({firstName, 
  lastName, 
  email, 
  phone, 
  positionId: position
});
     


    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};