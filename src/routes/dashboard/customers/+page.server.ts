import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { appointments, customers, user } from '$lib/server/db/schema';
import { eq,and, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {

    const customersList = await db
        .select({
            id: customers.id,
            customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,
            phone: customers.phone,
            appointmentCount: sql<number>`COUNT(${appointments.id})`,
            daysSinceJoined: sql<number>`DATEDIFF(CURRENT_DATE, ${customers.createdAt})`,
            createdBy: user.name,
            createdById: user.id,
            createdAt:   sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`,
        })
        .from(customers)
        .leftJoin(appointments, eq(customers.id, appointments.customerId))
        .leftJoin(user, eq(customers.createdBy, user.id))
        .where(
          and(
            eq(customers.branchId, locals?.user?.branch)
          ))
        .groupBy(customers.id, user.name, customers.createdAt, customers.firstName, customers.lastName, customers.phone)
      

    return {
        customersList,
    };
};