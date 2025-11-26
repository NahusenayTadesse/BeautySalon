

import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer} from '$lib/ZodSchema';
import { db } from "$lib/server/db";
import { appointments, customers, paymentMethods, transactionBookingFee, transactions, user  } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';


export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const { id } = params;

        const form = await superValidate(zod4(editCustomer));

        const customer = await db.select(
            { 
                id: customers.id,
                firstName: customers.firstName,
                lastName: customers.lastName,
                gender: customers.gender,
                customerId: customers.id,
                phone: customers.phone,
                appointmentCount: sql<number>`COUNT(${appointments.id})`,
                joinedOn: sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`,
                daysSinceJoined: sql<number>`DATEDIFF(CURRENT_DATE, ${customers.createdAt})`,
                time: sql<string>`DATE_FORMAT(${appointments.appointmentTime}, '%H:%i')`,
                addedBy: user.name, 
                addedById: user.id, 
            }
        )
        .from(customers)
        .leftJoin(appointments, eq(customers.id, appointments.customerId))
        .leftJoin(user, eq(customers.createdBy, user.id))
        .where(
            and(
                eq(customers.branchId, locals?.user?.branch),
                eq(customers.id, id)
            ))
        .groupBy(customers.id, user.name, customers.createdAt, customers.firstName, customers.lastName, customers.phone)
        .then(rows => rows[0]);

        const reciepts = await db.select({
            id: customers.id,
            customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,

            appointmentDate: sql<string>`DATE_FORMAT(${appointments.appointmentDate}, '%Y-%m-%d')`,
            amount: transactions.amount,
            booker: user.id,
            recievedBy: user.name,
            paidAt: sql<string>`DATE_FORMAT(${transactions.createdAt}, '%Y-%m-%d')`,
            recieptLink: transactions.recieptLink
        }).from(transactionBookingFee)
        .innerJoin(appointments, eq(transactionBookingFee.appointmentId,appointments.id))
        .leftJoin(customers, eq(appointments.customerId, customers.id))
        .leftJoin(transactions, eq(transactionBookingFee.transactionId, transactions.id))
        .leftJoin(user, eq(transactions.createdBy, user.id))
        .where(
            and(
                eq(appointments.branchId, locals?.user?.branch),
                eq(appointments.id, id)
            )
        ).orderBy(transactions.createdAt);

        const allMethods = await db
            .select({
                value: paymentMethods.id,
                name: paymentMethods.name,
                description: paymentMethods.description
            })
            .from(paymentMethods).where(eq(paymentMethods.isActive, true));

        return {
            customer,
            form,
            allMethods,
            reciepts,
        };
    } catch (error) {
        console.error('Error loading customer dashboard:', error);
        return {
            customer: null,
            form: null,
            allMethods: [],
            reciepts: [],
            error: 'Failed to load customer dashboard.'
        };
    }
}


export const actions: Actions = {
     
    editCustomer: async ({request, locals, cookies}) => {
          
              const form = await superValidate(request, zod4(editCustomer));
  
    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form." }, cookies);
      return fail(400, { form });
    }
    const {firstName, lastName, gender, phone, customerId} = form.data;
     
    try{

       await db.update(customers).set({
        firstName,
        lastName,
        gender: (gender === "male" || gender === "female") ? gender : undefined,
        phone,
        updatedBy: locals?.user?.id,
      }).where(eq(customers.id, customerId));
 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "Customer updated Successfully Added" }, cookies);
      return {
        form
      };
    } catch(err){
      console.error("Error" + err)
      setFlash({ type: 'error', message: "Error: Something Went Wrong Try Again" }, cookies);

      return fail(400, {
        form
      });
    }


  },
  delete: async({cookies, params })=> {
   
      const {id} = params;
       
  
      try {
        if (!id) {
          setFlash({ type: 'error', message: 'Invalid appointment id.' }, cookies);
          return fail(400);
        }
  
        await db.delete(customers).where(eq(customers.id, id));
  
         
           setFlash({ type: 'success', message: "Delete Successful!" }, cookies);
  
          redirect(303, `/dashboard/customers`)
       
  
      } catch (err) {
        console.error('Error deleting appointment:', err);
        setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
      }
      
  
  
    },
}
