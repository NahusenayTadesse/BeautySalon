import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editSupply as schema } from '$lib/ZodSchema';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { supplies, transactionSupplies, transactions, user } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));

	const supply = await db
		.select({
			id: supplies.id,
			name: supplies.name,
			costPerUnit: supplies.costPerUnit,
			description: supplies.description,
			quantity: supplies.quantity,
			reorderLevel: supplies.reorderLevel,
			unitOfMeasure: supplies.unitOfMeasure,
			supplier: supplies.supplier,
			createdBy: user.name,
			createdAt: sql<string>`DATE_FORMAT(${supplies.createdAt}, '%Y-%m-%d')`,
			paidAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(supplies)
		.leftJoin(transactionSupplies, eq(supplies.id, transactionSupplies.supplyId))
		.leftJoin(transactions, eq(transactionSupplies.transactionId, transactions.id))
		.leftJoin(user, eq(supplies.createdBy, user.id))
		.where(and(eq(supplies.branchId, locals?.user?.branch), eq(supplies.id, id)))
		.groupBy(
			supplies.id,
			supplies.name,
			supplies.costPerUnit,
			supplies.description,
			supplies.quantity,
			supplies.reorderLevel,
			supplies.supplier,
			user.name,
			supplies.createdAt
		)
		.then((rows) => rows[0]);

	if (!supply) {
		throw error(404, 'Supply not found, it has been deleted or never have existed.');
	}

	return {
		supply,
		form
	};
};

export const actions: Actions = {
	editSupply: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const {
			supplyId,
			supplyName,
			description,
			unitOfMeasure,
			quantity,
			supplier,
			reorderLevel,
			costPerUnit
		} = form.data;

		try {
			await db
				.update(supplies)
				.set({
					name: supplyName,
					description,
					unitOfMeasure,
					quantity,
					costPerUnit,
					supplier,
					reorderLevel,
					branchId: locals?.user?.branch,
					updatedBy: locals?.user?.id
				})
				.where(eq(supplies.id, supplyId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'New Supply Successuflly Added' }, cookies);
			return {
				form
			};
		} catch (err) {
			console.error('Error' + err);
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(supplies).where(eq(supplies.id, id));

			setFlash({ type: 'success', message: 'Supply Deleted Successfully!' }, cookies);
		} catch (err) {
			console.error('Error deleting supply:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}

	// delete: async ({ cookies, params }) => {
	// 	const { id } = params;

	// 	try {
	// 		if (!id) {
	// 			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
	// 			return fail(400);
	// 		}

	// 		await db.delete(supplies).where(eq(supplies.id, id));

	// 		setFlash({ type: 'success', message: 'Supply Deleted Successfully!' }, cookies);
	// 	} catch (err) {
	// 		console.error('Error deleting supply:', err);
	// 		setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
	// 		return fail(400);
	// 	}
	// }
};
