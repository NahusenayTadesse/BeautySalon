import { db } from "$lib/server/db";
import { commissionProduct, commissionService, customers, paymentMethods, products as prds, services as srvs, staff, transactionProducts, transactions, transactionServices } from '$lib/server/db/schema';
import { eq, sql } from "drizzle-orm";
import { superValidate, fail, fileProxy } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { salesSchema as schema } from '$lib/zodschemas/salesSchema'
import type { Actions } from "./$types";
import { setFlash } from "sveltekit-flash-message/server";

export async function load({ locals }) {
    const fetchedServices = await db
        .select({
           value: srvs.id,
            name: sql<string>`TRIM(CONCAT(${srvs.name}, ' ', COALESCE(CONCAT(${srvs.price}, ' ETB'), '')))` ,
            price: srvs.price
        })
        .from(srvs).where(eq(srvs.branchId, locals.user?.branch));

    const fetchedProducts = await db
        .select({
            value: prds.id,
            name: sql<string>`TRIM(CONCAT(${prds.name}, ' ', COALESCE(CONCAT(${prds.price}, ' ETB'), '')))` ,
            price: prds.price
        })
        .from(prds).where(eq(prds.branchId, locals.user?.branch));

     const fetchedStaff = await db
        .select({
            value: staff.id,
            name: sql<string>`TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))`,
        })
        .from(staff).where(eq(staff.branchId, locals.user?.branch));


         const fetchedCustomer = await db
        .select({
            value: customers.id,
            name: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,
        })
        .from(customers).where(eq(customers.branchId, locals.user?.branch));


          const form = await superValidate(zod4(schema));

   const allMethods = await db
                .select({
                  value: paymentMethods.id,
                  name: paymentMethods.name,
                  description: paymentMethods.description
                })
                .from(paymentMethods).where(eq(paymentMethods.isActive, true));
    return {
        services: fetchedServices,
        products: fetchedProducts,
        staffes: fetchedStaff,
        customers: fetchedCustomer,
        allMethods,
        
        form
       
    };
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
  addSales: async({request, cookies, locals}) => {

    
    const formData = await request.formData();

    const form = await superValidate(formData, zod4(schema));

    const { paymentMethod, total, receipt } = form.data; 


const product_staff = formData.getAll('product_staff');   // ← fix typo
const product       = formData.getAll('product');
const noofproducts  = formData.getAll('noofproducts');
const tip           = formData.getAll('tip');

const service_staff = formData.getAll('service_staff');
const service       = formData.getAll('service');
const serviceTip    = formData.getAll('serviceTip');
    
    
    

        
     console.log(form);

        // if (!form.valid) {
        //    // Stay on the same page and set a flash message
        //    setFlash({ type: 'error', message: "Please check your form data." }, cookies);
        //    return fail(400, { form });
        //  }

    //  console.log(products[0].product, products[0].staff, products[0].noofproducts, products[0].tip)

     const imageName = `${generateUserId()}${path.extname(receipt.name)}`;
    
    const file_path: string = path.normalize(
       path.join(FILES_DIR, imageName));    		
    
        const nodejs_wstream = fs.createWriteStream(file_path);
        const web_rstream = receipt.stream();
        const nodejs_rstream = Readable.fromWeb(web_rstream);
        await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
                     setFlash({ type: 'error', message: "Upload Failed" }, cookies);

        });


      

    //  if (!form.valid) {
    //        // Stay on the same page and set a flash message
    //        setFlash({ type: 'error', message: "Please check your form data." }, cookies);
    //        return fail(400, { form });
    //      }

          try {
      await db.transaction(async (tx) => {
        // 1. master transaction row
        const [txn] = await tx
          .insert(transactions)
          .values({
            amount: total,
            paymentStatus: 'paid', // or map from UI if you add the field
            paymentMethodId: paymentMethod, 
            recieptLink: imageName,
            branchId: locals.user?.branch,
            createdBy: locals.user?.id
          })
          .$returningId(); 



           const fetchedProducts = await tx          // ← tx, not db
  .select({ value: prds.id, price: prds.price,
      commissionProduct: prds.commissionAmount,
   })
  .from(prds)
  .where(eq(prds.branchId, locals.user?.branch));

const fetchedServices = await tx          // ← tx, not db
  .select({ value: srvs.id, price: srvs.price, commissionService: srvs.commissionAmount })
  .from(srvs)
  .where(eq(srvs.branchId, locals.user?.branch));
         

      
        // 2. product lines
        if (product.length) { 
          
   const txnPrdId = await tx.insert(transactionProducts).values(
    product.map((_, idx) => ({
      transactionId: txn.id,
      staffId:       product_staff[idx]  || null,
      productId:     product[idx]        || null,
      quantity:      noofproducts[idx],
      unitPrice:     getPrice(fetchedProducts, product[idx]),
      tip:           tip[idx],
      total:
        getPrice(fetchedProducts, product[idx]) * noofproducts[idx]
        + Number(tip[idx] || 0),
        branchId: locals.user?.branch,
            createdBy: locals.user?.id
    }))
  ).$returningId();

   const today = new Date();

    await tx.insert(commissionProduct).values(
         product.map((_, idx) => ({
           
          saleItemId: txnPrdId[idx].id,
          staffId: product_staff[idx],
          amount: getCommission(fetchedProducts, product[idx]) * noofproducts[idx],
          commissionDate: today,
          branchId: locals.user?.branch,
          createdBy: locals.user?.id
         }
        )
      )
    );

  }

  

  
 

// 4. service lines
if (service.length) {
   const txnsrvid = await tx.insert(transactionServices).values(
    service.map((_, idx) => ({
      transactionId: txn.id,
      staffId:       service_staff[idx] || null,
      serviceId:     service[idx]       || null,
      price:         getPrice(fetchedServices, service[idx]),
      tip:           serviceTip[idx],
      total:
        getPrice(fetchedServices, service[idx])
        + Number(serviceTip[idx] || 0),
    }))
  ).$returningId();
     const today = new Date();
     await tx.insert(commissionService).values(
         service.map((_, idx) => ({
           
          saleItemId: txnsrvid[idx].id,
          staffId: service_staff[idx],
          amount: getCommission(fetchedServices, service[idx]),
          commissionDate: today,
          branchId: locals.user?.branch,
          createdBy: locals.user?.id
         }
        )
      )
    );
}
      });

       return  setFlash({ type: 'success', message: "New Sale Successuflly Added" }, cookies);
    } catch (e) {
         console.error('Sale insert failed', e);
          setFlash({ type: 'error', message: "Error " + e }, cookies);
    }
  

  },
}

    


     

function getPrice(
  list: Array<{ value: number; price: string }>,
  value: number
): number {
  const item = list.find((i) => i.value === value);
  return item ? Number(item.price) : 0;
}

function getCommission(
  list: Array<{ value: number; price: string; commissionPct: string | null }>,
  value: number
): number {
  const item = list.find((i) => i.value === value);
  if (!item) return 0;
  const pct = Number(item.commissionPct ?? 0);
  return (Number(item.price) * pct) / 100;
}