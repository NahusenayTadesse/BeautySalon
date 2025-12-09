import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { insertExpenseSchema as schema } from './expenseSchema';
import { db } from '$lib/server/db';
import { expenses, expensesType as serviceCategories } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(schema));
	const categories = await db
		.select({
			value: serviceCategories.id,
			name: serviceCategories.name,
			description: serviceCategories.description
		})
		.from(serviceCategories);

	return {
		form,
		categories
	};
};

export const actions: Actions = {
	addProduct: async ({ request }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { expenseDate, type, description, total, reciept } = form.data;

		try {
			await db.insert(expenses).values({ expenseDate, type, description, total, reciept });

			return {
				form
			};
		} catch (err) {
			console.error('Error' + err);
		}
	}
};
