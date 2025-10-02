
import fs from 'node:fs';
import path from 'node:path';
import { generateUserId } from '$lib/global.svelte';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { bookingFeeSchema as schema} from '$lib/zodschemas/appointmentSchema';


const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

import { db } from "$lib/server/db";
import { appointments, appointmentStatuses, customers, paymentMethods, transactionBookingFee, transactions, user  } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';



export const load: PageServerLoad = async ({ params, locals }) => {


     const {id} = params;
       const form = await superValidate(zod4(schema));
        const appointmentsList = await db.select(
          { 
            id: appointments.id,
            customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,

            phone: customers.phone,
            date: sql<string>`DATE_FORMAT(${appointments.appointmentDate}, '%Y-%m-%d')`,
            time: sql<string>`DATE_FORMAT(${appointments.appointmentTime}, '%H:%i')`,
            bookedBy: user.name,  
            status: appointmentStatuses.name,
            notes: appointments.notes,
            bookedAt: sql<string>`DATE_FORMAT(${appointments.createdAt}, '%Y-%m-%d')`,
            recieptLink: transactions.recieptLink,
          }
        )
        .from(appointments)
        .leftJoin(customers, eq(appointments.customerId, customers.id))
        .leftJoin(user, eq(appointments.createdBy, user.id))
        .leftJoin(appointmentStatuses, eq(appointments.statusId, appointmentStatuses.id))
        .leftJoin(transactionBookingFee, eq(appointments.id, transactionBookingFee.appointmentId))
        .leftJoin(transactions, eq(transactionBookingFee.transactionId, transactions.id))
        .where(
          and(
            eq(appointments.branchId, locals?.user?.branch),
            eq(appointments.id, id)
          )
        )
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
        ).orderBy(transactions.createdAt)



       
         const allMethods = await db
                .select({
                  value: paymentMethods.id,
                  name: paymentMethods.name,
                  description: paymentMethods.description
                })
                .from(paymentMethods).where(eq(paymentMethods.isActive, true));

   

        return {
            appointmentsList,
            form,
            allMethods,
            reciepts
        }
}


export const actions: Actions = {
  confirmAppointment: async ({request, cookies, locals}) => {
     const form = await superValidate(request, zod4(schema));
 

     if (!form.valid) {
           // Stay on the same page and set a flash message
           setFlash({ type: 'error', message: "Please check your form data." }, cookies);
           return fail(400, { form });
         }
     
   const {appointmentId, paymentStatus, amount, paymentMethod, image } = form.data;


   try{

     const imageName = `${generateUserId()}${path.extname(image.name)}`;

const file_path: string = path.normalize(
  path.join(FILES_DIR, imageName)
);    		// const file_path = fs.statSync(path.normalize(path.join(FILES_DIR, image.name)));

         
    // if (fs.existsSync(file_path)) {
    //     setFlash({ type: 'error', message: "The problem is here" }, cookies);
 
    //     return fail(400, withFiles({ form }));    
    //   }

    const nodejs_wstream = fs.createWriteStream(file_path);
    const web_rstream = image.stream();
    const nodejs_rstream = Readable.fromWeb(web_rstream);
    await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
      return fail(500);
    });

        const [transaction] = await db.insert(transactions).values(
              {
              amount,
              paymentMethodId: paymentMethod,
              recieptLink: imageName,
              paymentStatus,
              branchId: locals.user?.branch,
              createdBy: locals.user?.id
            }

        ).$returningId();

         await db.insert(transactionBookingFee).values({
            fee: amount, 
            transactionId: transaction.id,
            appointmentId,
         });

        await db.update(appointments)
        .set({ statusId: 2, updatedBy: locals.user?.id })
        .where(eq(appointments.id, appointmentId));

        delete form.data.image;

       setFlash({ type: 'success', message: "Successfully Confirmed Appointment "  }, cookies);
    return {   
     form    
 }; 
} catch(err){
         
         setFlash({ type: 'error', message: `Unexpected Error: ${err.message}`}, cookies);
                 return fail(400, {
                 form
               });
    }

  },

  test: async({request})=>{

    const formData = await request.formData();

      const image = formData.getAll('image');

      return {
         console: console.log('image Recieved', image)
      }
 
     
  }
}