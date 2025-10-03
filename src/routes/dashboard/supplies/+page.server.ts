import { db } from "$lib/server/db";
import {  supplies } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "../$types";




export const load: PageServerLoad = async({locals})=>{
     
    

    const supplyList = await db.select(
        {
            id: supplies.id,
            name: supplies.name,
            price: supplies.costPerUnit,
            description: supplies.description,
            quantity: supplies.quantity,
            supplier: supplies.supplier,

        }
    ).from(supplies)
    .where(eq(supplies.branchId, locals?.user?.branch))
  


    return{
         supplyList
    }
}