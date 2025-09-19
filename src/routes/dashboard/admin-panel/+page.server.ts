import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { createRoleSchema as schema } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {  rolePermissions, roles } from '$lib/server/db/schema.js';
import type {  Actions } from "./$types";
// import type { PageServerLoad } from './$types.js';



// export const load: PageServerLoad = async () => {
 
// };


import { setFlash} from 'sveltekit-flash-message/server';

export const actions: Actions = {
  addRole: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
    setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);

      return fail(400, {
        form
      });
    }


const { 
  name, 
  description,
  permissions,  
} = form.data;



    
    try{

      const [role] = await db
        .insert(roles)
        .values({ name, description }).$returningId();

      await db.insert(rolePermissions).values(
        permissions.map((permId) => ({
          roleId: role.id,
          permissionId: permId,
        }))
      );

      setFlash({ type: 'success', message: `Role created successfully!` }, cookies);
    


    return {
      form
    } } catch(err: any){
     
            
    setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Role Name is already taken. Please choose another one.': err.message }, cookies);
           if(err.code === 'ER_DUP_ENTRY')
           return setError(form, 'name', 'Role Name already exists.');

        return fail(400, {
        form
      });
    }
  },
}