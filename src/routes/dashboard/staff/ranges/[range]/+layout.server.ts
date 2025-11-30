
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {  editStaff as schema } from '$lib/zodschemas/appointmentSchema';



import { db } from "$lib/server/db";
import {  staff, staffTypes, salaries, user  } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {

       const {range} = params;

     const id  = range.split("-").pop();

  const form = await superValidate(zod4(schema));
 
 
         const staffMember = await db.select(
           { 
            id: staff.id,
            firstName: staff.firstName,
            lastName: staff.lastName,
            
             category: staffTypes.name,
             categoryId: staffTypes.id,
             phone: staff.phone,
             email: staff.email,
             status: staff.employmentStatus,
             salary: salaries.amount,
             hireDate: sql<string>`DATE_FORMAT(${staff.hireDate}, '%Y-%m-%d')`,
             govId: staff.govtId,
              contract: staff.contract,
             
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
            categories
     }
} 
