import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { insertExpenseSchema as schema } from './expenseSchema';
import { db } from '$lib/server/db';
import { expenses, expensesType, transactions, paymentMethods } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';


export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	const categories = await db
		.select({
			value: expensesType.id,
			name: expensesType.name,
			description: expensesType.description
		})
		.from(expensesType);
		const paymentMethod = await db
		.select({
			value: paymentMethods.id,
			name: paymentMethods.name,
		})
		.from(paymentMethods);

	return {
		form,
		categories,
		paymentMethod
	};
};
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
	addExpense: async ({ request, cookies, locals }) => {
		console.log('Connected')
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { expenseDate, type, description, total, paymentMethod, reciept } = form.data;

		try { 
                const imageName = `${generateUserId()}${path.extname(reciept.name)}`;
			   
			   const file_path: string = path.normalize(
				 path.join(FILES_DIR, imageName));    		
			   
				   const nodejs_wstream = fs.createWriteStream(file_path);
				   const web_rstream = reciept.stream();
				   const nodejs_rstream = Readable.fromWeb(web_rstream);
				   await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
					 return fail(500);
				   });

			 const [transactionId] = await db.insert(transactions).values({
				  amount: total,
				  paymentStatus: 'paid',
				  paymentMethodId: paymentMethod,				  
				  recieptLink: imageName,
				  createdAt: locals.user?.id,
				  branchId: locals.user?.branch
			 }).$returningId();

			await db.insert(expenses).values({ expenseDate, type, description, total, transactionId,  createdAt: locals.user?.id,
				  branchId: locals.user?.branch  });

			delete form.data.reciept; 

			         console.log('🔍 form.data.reciept before return:', form.data.reciept);


			setFlash({ type: 'success', message: "New Expense Successuflly Added" }, cookies);


			return {
				form
			};
		} catch (err) {
			console.error('Error' + err);
			setFlash({ type: 'error', message: "Error: " + err }, cookies);

		}
	}
};
