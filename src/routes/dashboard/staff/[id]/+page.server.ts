

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {  editService as schema } from '$lib/ZodSchema';



import { db } from "$lib/server/db";
import {  staff, staffTypes, salaries, staffContacts, staffSchedule, staffServices, user  } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';



export const load: PageServerLoad = async ({ params, locals }) => {


     const {id} = params;
       const form = await superValidate(zod4(schema));


        const staffMember = await db.select(
          { 
           id: staff.id,
          name: sql<string>`TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))`,
           
            category: staffTypes.name,
            phone: staff.phone,
            email: staff.email,
            status: staff.employmentStatus,
            salary: salaries.amount,
            hireDate: sql<string>`DATE_FORMAT(${staff.hireDate}, '%Y-%m-%d')`,
            
            addedBy: user.name,
            years: sql<number>`TIMESTAMPDIFF(YEAR, ${staff.hireDate}, CURDATE())`,

          }
        )
        .from(staff)
        .leftJoin(staffTypes, eq(staff.type, staffTypes.id))
        .leftJoin(salaries, eq(staff.id, salaries.staffId))
        .leftJoin(user, eq(staff.createdBy, user.id))
          .where(
            and  
            (
              eq(staff.branchId, locals?.user?.branch),
              eq(staff.id, id)
            ))
        .then(rows => rows[0]);


      

         const categories = await db
                .select({
                  value: staffTypes.id,
                  name: staffTypes.name,
                  description: staffTypes.description
                })
                .from(staffTypes);

        return {
            staffMember,
           
            form,
            categories,
   
        }
}


export const actions: Actions = {
  editProduct: async ({ request, cookies, locals }) => {
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      return fail(400, { form });
    }


        const { serviceId, serviceName, category, durationMinutes, description, commission, price } = form.data;
    
    try{
     await db.update(services).set({
        name: serviceName, commissionAmount: commission.toString(), description, categoryId: category,
        durationMinutes,
        price: price.toString(),
        updatedBy: locals?.user?.id
    }).where(eq(services.id, serviceId));

 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "Service Updated Successuflly" }, cookies);
    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  }
};