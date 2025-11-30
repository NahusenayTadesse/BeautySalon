import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { appointments, products, reports, supplies } from '$lib/server/db/schema';
import {and, eq, lte, sql } from 'drizzle-orm';
export const load: PageServerLoad = async ({locals}) => {
  
     const noOfAppointments = await db.select(
         { count: appointments.id}
     ).from(appointments)
     .where( and
        (eq(appointments.branchId, locals.user?.branch),
        eq(appointments.appointmentDate, new Date())
    
    )
     );

     const reorderProducts = await db.select( 
        {
             name: products.name,
             quantity: products.quantity,

        } 
    ).from(products)
    .where(
        and
        (eq(products.branchId, locals.user?.branch),
        lte(products.reorderLevel, products.quantity)
    )
    ); 

     const reorderSupplies = await db.select( 
        {
             name: supplies.name,
            quantity: supplies.quantity,

        } 
    ).from(supplies)
    .where(
        and
        (eq(supplies.branchId, locals.user?.branch),
        lte(supplies.reorderLevel, supplies.quantity)
    )
    ); 

    const todayReport = await db.select(
            {
                id: reports.id,
    date: sql<string>`DATE_FORMAT(${reports.reportDate}, '%W %Y-%m-%d')`,
                bookedAppointments: reports.bookedAppointments,
                productsSold: reports.productsSold,
                serviceRendered: reports.servicesRendered,
                dailyExpenses: reports.dailyExpenses,
                dailyIncome: reports.dailyIncome,
                transactions: reports.transactions,
                staffPaid: reports.staffPaid,
                totalStaffPaid: reports.totalStaffPaid,
                staffHired: reports.staffHired,
                staffFired: reports.staffFired
            }
        ).from(reports)
        .where ( and(
            eq(reports.branchId, locals.user?.branch ),
            eq(reports.reportDate, new Date())
            ));

    return { 

         nofAppointments: noOfAppointments.length,
         reorderProducts,
         reorderSupplies,
         todayReport,

    };
};

export const actions: Actions = {
    logout: async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(event.locals.session.id);
        auth.deleteSessionTokenCookie(event);

        return redirect(302, '/demo/lucia/login');
    }
};

