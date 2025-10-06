import { message, setError,superValidate, withFiles } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { staffSchema } from '$lib/zodschemas/appointmentSchema';
import { db } from '$lib/server/db';
import { staffTypes as positions, salaries, staff } from '$lib/server/db/schema/';
import type {  Actions } from "./$types";
import type { PageServerLoad } from './$types.js';


export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(staffSchema));

  const allPositions = await db.select({
      value: positions.id,
      name: positions.name,
      description: positions.description
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

import fs from 'node:fs';
import path from 'node:path';
import { generateUserId } from '$lib/global.svelte';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';
import { setFlash } from 'sveltekit-flash-message/server';
const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}


export const actions: Actions = {
  addStaff: async ({ request, cookies, locals }) => {

    console.log('connected')
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
  position,
  salary,
  hiredAt,
  contract,
  govId
} = form.data;

    


    
    try{

           const imageName = `${generateUserId()}${path.extname(govId.name)}`;

           const govPath: string = path.normalize(
  path.join(FILES_DIR, imageName));    		

    const nodejs_wstream = fs.createWriteStream(govPath);
    const web_rstream = govId.stream();
    const nodejs_rstream = Readable.fromWeb(web_rstream);
    await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {

      return fail(500);
    });

     const contractName = `${generateUserId()}${path.extname(contract.name)}`;

           const contractPath: string = path.normalize(
  path.join(FILES_DIR, contractName));    		

    const nodejs_wstreamContract = fs.createWriteStream(contractPath);
    const web_rstreamContract = contract.stream();
    const nodejs_rstreamContract = Readable.fromWeb(web_rstreamContract);
    await pipeline(nodejs_rstreamContract, nodejs_wstreamContract).catch(() => {
      return fail(500);
    });
      
     const [staffMember] = await db.insert(staff).values({firstName, 
  lastName, 
  email, 
  phone, 
  govId: govPath,
  contract: contractPath,
  type: position,
  hireDate: hiredAt,
  createdBy: locals.user?.id,
  branchId: locals.user?.branch

}).$returningId(); 

   await db.insert(salaries).values({
       amount: salary,
       staffId: staffMember.id,
         createdBy: locals.user?.id,
  branchId: locals.user?.branch
   })

     
    

     setFlash({ type: 'success', message: 'Staff Successfully Added' }, cookies);
    return message(form, 'Ha')
		} catch(err){
             console.error("Error" + err)
             setFlash({ type: 'error', message: err.code === 'ER_DUP_ENTRY' ? 'Phone number is already taken. Please choose another one.': err.message }, cookies);
                    
                 if(err.code === 'ER_DUP_ENTRY')
                        return setError(form, 'phone', 'Phone Number already exists.');
                       
             
                     return fail(400, {
                     form
                   });
        }
	}
};