import { db } from "$lib/server/db";
import { products, services } from '$lib/server/db/schema';
import { eq } from "drizzle-orm";


export async function load({ locals }) {
    const fetchedServices = await db
        .select({
           value: services.id,
            name: services.name,
            price: services.price
        })
        .from(services).where(eq(services.branchId, locals.user?.branch));;

    const fetchedProducts = await db
        .select({
            value: products.id,
            name: products.name,
            price: products.price
        })
        .from(products).where(eq(products.branchId, locals.user?.branch));

    return {
        services: fetchedServices,
        products: fetchedProducts
    };
}