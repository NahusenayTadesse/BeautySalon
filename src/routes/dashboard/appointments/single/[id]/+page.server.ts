
import fs from 'node:fs';
import path from 'node:path';
import { generateUserId } from '$lib/global.svelte';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { bookingFeeSchema as schema } from '$lib/zodschemas/appointmentSchema';


const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

import { db } from "$lib/server/db";
import { appointments, appointmentStatuses, customers, paymentMethods, user  } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from 'sveltekit-superforms';



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
            bookedAt: sql<string>`DATE_FORMAT(${appointments.createdAt}, '%Y-%m-%d')`
        }
        ).from(appointments)
        .leftJoin(customers, eq(appointments.customerId, customers.id))
        .leftJoin(user, eq(appointments.createdBy, user.id))
        .leftJoin(appointmentStatuses, eq(appointments.statusId, appointmentStatuses.id))
        .where(
            and(
                eq(appointments.branchId, locals?.user?.branch),
                eq(appointments.id, id)
            )
        ).then(rows => rows[0]);

       
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
            allMethods
            
        }
}


export const actions: Actions = {
  confirmAppointment: async ({request}) => {

     
    const formData = await request.formData();

    const image = formData.get('image') as File;

const file_path: string = path.normalize(
  path.join(FILES_DIR, `${generateUserId()}${path.extname(image.name)}`)
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

    return { success: true, path: image.name };

  }
}