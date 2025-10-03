import { db } from "$lib/server/db";
import { products, productCategories } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";
import type { PageServerLoad } from "../$types";
import { transactionProducts } from "$lib/server/db/schema";




export const load: PageServerLoad = async({locals})=>{
     
    

    const productList = await db.select(
        {
            id: products.id,
            name: products.name,
            price: products.price,
            description: products.description,
            category: productCategories.name,
            commission: products.commissionAmount,
            quantity: products.quantity,
            supplier: products.supplier,
            saleCount: sql<number>`SUM(${transactionProducts.quantity })`,

        }
    ).from(products)
    .leftJoin(productCategories, eq(productCategories.id, products.categoryId))
    .leftJoin(transactionProducts, eq(products.id, transactionProducts.productId))
    .where(eq(products.branchId, locals?.user?.branch))
    .groupBy(
                products.id,
                products.name,
                products.price,
                products.description,
                productCategories.name,
                products.commissionAmount,
                products.quantity,
                products.supplier,
                transactionProducts.id
            );


    return{
         productList
    }
}