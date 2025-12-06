

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {  editProduct as schema } from '$lib/ZodSchema';



import { db } from "$lib/server/db";
import {  salaries, deductions, commissionProduct, commissionService, staff, transactions, user  } from "$lib/server/db/schema";
import { eq, and, sql, count } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';



export const load: PageServerLoad = async ({ params}) => {


     const {id} = params;
       const form = await superValidate(zod4(schema));


        const salaryDetail = await db.select({
          id: staff.id,
          name: sql<string>`TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))`,

          // sum of all deductions for the staff
          deductions: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`,

          // sum of all commissions from commissionProduct AND commissionService
          commissions: sql<number>`
           COALESCE(SUM(${commissionProduct.amount}), 0)
           + COALESCE(SUM(${commissionService.amount}), 0)
          `,

          // base salary (assumed single row per staff)
          baseSalary: salaries.amount,
        })
          .from(staff)
          .leftJoin(salaries, eq(salaries.staffId, staff.id))
          .leftJoin(deductions, eq(deductions.staffId, staff.id))
          .leftJoin(commissionProduct, eq(commissionProduct.staffId, staff.id))
          .leftJoin(commissionService, eq(commissionService.staffId, staff.id))
          .where((eq(staff.id, id)),
                   
        )
          .groupBy(staff.id, salaries.amount)
          .then(rows=> rows[0]);

       

        return {
            salaryDetail,
           
            form,
        
   
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


        const { productId, productName, category, description, commission, quantity, price, supplier, reorderLevel, costPerUnit } = form.data;

    
    try{
     await db.update(products).set({
        name: productName, commissionAmount: commission.toString(), description, categoryId: category,
        quantity, price: price.toString(), supplier, reorderLevel, cost: costPerUnit.toString(),
        updatedBy: locals?.user?.id
    }).where(eq(products.id, productId));

 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "Product Updated Successuflly Added" }, cookies);
    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  },
    delete: async({cookies, params })=> {
     
        const {id} = params;
         
    
        try {
        if (!id) {
        setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
          return fail(400);
        }
  
        await db.delete(products).where(eq(products.id, id));
  
         
          setFlash({ type: 'success', message: "Product Deleted Successfully!" }, cookies);
  
      } catch (err) {
        console.error('Error deleting product:', err);
        setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
        return fail(400)
      }
      
        
    
    
      },
};