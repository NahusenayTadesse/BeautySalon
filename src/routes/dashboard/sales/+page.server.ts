import { db } from "$lib/server/db";
import { products, services, staff, transactionProducts } from '$lib/server/db/schema';
import { eq, sql } from "drizzle-orm";
import { superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { salesSchema as schema } from '$lib/zodschemas/salesSchema'
import type { Actions } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";

export async function load({ locals }) {
    const fetchedServices = await db
        .select({
           value: services.id,
            name: sql<string>`TRIM(CONCAT(${services.name}, ' ', COALESCE(CONCAT(${services.price}, ' ETB'), '')))` ,
            price: services.price
        })
        .from(services).where(eq(services.branchId, locals.user?.branch));

    const fetchedProducts = await db
        .select({
            value: products.id,
            name: sql<string>`TRIM(CONCAT(${products.name}, ' ', COALESCE(CONCAT(${products.price}, ' ETB'), '')))` ,
            price: products.price
        })
        .from(products).where(eq(products.branchId, locals.user?.branch));

     const fetchedStaff = await db
        .select({
            value: staff.id,
            name: sql<string>`TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))`,
        })
        .from(staff).where(eq(staff.branchId, locals.user?.branch));


          const form = await superValidate(zod4(schema));


    return {
        services: fetchedServices,
        products: fetchedProducts,
        staffes: fetchedStaff,
        form
       
    };
}


export const actions: Actions = {
  addSales: async({request, cookies}) => {

    console.log('connected')

    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      return fail(400, { form });
    }       
     
          const { products, services, productAmount, serviceAmount, receipt } = form.data;


          
          
       
          setFlash({ type: 'success', message: "Form Success" }, cookies);


          

          return {
            form
          }

  }
     
}
