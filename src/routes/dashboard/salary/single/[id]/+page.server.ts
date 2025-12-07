

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { addLeavePayrollSchema as schema } from './schema';



import { db } from "$lib/server/db";
import {  salaries, paymentMethods, overTime, deductions, bonuses, commissionProduct, commissionService, staff, transactions, user, payrollEntries  } from "$lib/server/db/schema";
import { eq, sql} from "drizzle-orm";
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
          overtime: overTime.total,
          bonus: bonuses.amount

        })
          .from(staff)
          .leftJoin(salaries, eq(salaries.staffId, staff.id))
          .leftJoin(deductions, eq(deductions.staffId, staff.id))
          .leftJoin(overTime, eq(overTime.staffId, staff.id))
          .leftJoin(bonuses, eq(bonuses.staffId, staff.id))
          .leftJoin(commissionProduct, eq(commissionProduct.staffId, staff.id))
          .leftJoin(commissionService, eq(commissionService.staffId, staff.id))
          .where((eq(staff.id, id)),
                   
        )
          .groupBy(staff.id, salaries.amount)
          .then(rows=> rows[0]);
   

          const allMethods = await db.select({
                value: paymentMethods.id,
                name: paymentMethods.name,
                description: paymentMethods.description
              })
              .from(paymentMethods)
              .where(eq(paymentMethods.isActive, true));
       

        return {
            salaryDetail,
            allMethods,
            form,
        
   
        }
}

import fs from 'node:fs';
import path from 'node:path';
import { generateUserId } from '$lib/global.svelte';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';


const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

export const actions: Actions = {
  addSalary: async ({ request, cookies, params, locals }) => {

    console.log('Connected')

    const {id} = params;
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      
      return fail(400, { form });
    }


        const { month,  year,
  payPeriodStart,  // ISO date string  YYYY-MM-DD
  payPeriodEnd,
  baseSalary, // decimal as string
  overtime,
  deductions,
  commissions,
  bonus,
  netAmount,
  paidAmount,
  taxAmount,
  paymentMethod,
  paymentDate,
  notes,
  reciept } = form.data;

    
    try{

       

       const recieptLink = `${generateUserId()}${path.extname(reciept.name)}`;
      
      const file_path: string = path.normalize(
        path.join(FILES_DIR, recieptLink));    		
      
          const nodejs_wstream = fs.createWriteStream(file_path);
          const web_rstream = reciept.stream();
          const nodejs_rstream = Readable.fromWeb(web_rstream);
          await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
            setFlash({ type: 'error', message: "An Error occured while adding Salary " + err.message }, cookies);

         console.error("Error" + err.message)
          });
      
     await db.insert(payrollEntries).values({
         staffId: Number(id),
          month, 
         year,
  payPeriodStart: new Date(payPeriodStart),  // ISO date string  YYYY-MM-DD
  payPeriodEnd: new Date(payPeriodEnd),
  basicSalary: baseSalary.toString(), // decimal as string
  overtimeAmount: overtime?.toString(),
  deductions: deductions?.toString(),
  commissionAmount: commissions?.toString(),
  bonusAmount: bonus?.toString(),
  netAmount: netAmount.toString(),
  paidAmount: paidAmount.toString(),
  taxAmount: taxAmount?.toString(),
  paymentMethodId: paymentMethod,
  paymentDate: new Date(paymentDate),
  notes,
  recieptLink,
  createdBy: locals.user?.id,
  branchId: locals.user?.branch,
  status: 'paid'
        
        
    });

            delete form?.data?.reciept;

      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "Salary Record Successuflly Added" }, cookies);
    return {
      form
    } } catch(err){
          setFlash({ type: 'errror', message: "An Error occured while adding Salary " + err.message }, cookies);

         console.error("Error" + err.message)
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