import { db } from '$lib/server/db';
import {
	commissionProduct,
	commissionService,
	customers,
	paymentMethods,
	products as prds,
	reports,
	services as srvs,
	staff,
	tipsProduct,
	tipsService,
	transactionProducts,
	transactions,
	transactionServices
} from '$lib/server/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { salesSchema as schema } from '$lib/zodschemas/salesSchema';
import type { Actions } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';

export async function load() {
	const form = await superValidate(zod4(schema));

	const fetchedServices = await db
		.select({
			value: srvs.id,
			name: sql<string>`TRIM(CONCAT(${srvs.name}, ' ', COALESCE(CONCAT(${srvs.price}, ' ETB'),   '')))`,
			price: srvs.price
		})
		.from(srvs);

	const fetchedProducts = await db
		.select({
			value: prds.id,
			name: sql<string>`
TRIM(
  CONCAT(
    ${prds.name},
    COALESCE(CONCAT(' ', ${prds.price}, ' ETB'), ''),
    COALESCE(CONCAT(' ', ${prds.quantity}, ' Left'), '')
  )
)`,
			price: prds.price
		})
		.from(prds);

	const fetchedStaff = await db
		.select({
			value: staff.id,
			name: sql<string>`TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))`
		})
		.from(staff);

	const fetchedCustomer = await db
		.select({
			value: customers.id,
			name: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`
		})
		.from(customers);

	const allMethods = await db
		.select({
			value: paymentMethods.id,
			name: paymentMethods.name
		})
		.from(paymentMethods)
		.where(eq(paymentMethods.isActive, true));
	return {
		services: fetchedServices,
		products: fetchedProducts,
		staffes: fetchedStaff,
		customers: fetchedCustomer,
		allMethods,
		form
	};
}

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	addSales: async ({ request, cookies, locals }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, zod4(schema));

		if (!form.valid) {
			return message(form, { type: 'error', text: 'Please check the form for errors' });
		}

		const { products, services, paymentMethod, total, receipt, generalTip } = form.data;

		const gTip: number = Number(generalTip / (products.length + services.length));

		try {
			const recieptLink = await saveUploadedFile(receipt);
			delete form.data.receipt;
			await db.transaction(async (tx) => {
				// 1. master transaction row
				const [txn] = await tx
					.insert(transactions)
					.values({
						amount: total,
						paymentStatus: 'paid', // or map from UI if you add the field
						paymentMethodId: paymentMethod,
						recieptLink,
						branchId: locals.user?.branch,
						createdBy: locals.user?.id
					})
					.$returningId();

				const fetchedProducts = await tx // ← tx, not db
					.select({ value: prds.id, price: prds.price, commissionPct: prds.commissionAmount })
					.from(prds);

				const fetchedServices = await tx // ← tx, not db
					.select({ value: srvs.id, price: srvs.price, commissionPct: srvs.commissionAmount })
					.from(srvs);

				// 2. product lines
				if (products.length) {
					const txnPrdId = await tx
						.insert(transactionProducts)
						.values(
							products.map((_, idx) => ({
								transactionId: txn.id,
								staffId: products[idx].staff || null,
								productId: products[idx].product || null,
								quantity: products[idx].noofproducts,
								unitPrice: getPrice(fetchedProducts, Number(products[idx].product)),
								tip: products[idx].tip,
								total:
									Number(getPrice(fetchedProducts, Number(products[idx].product))) *
										Number(products[idx].noofproducts) +
									Number(products[idx].tip || 0),
								branchId: locals.user?.branch,
								createdBy: locals.user?.id
							}))
						)
						.$returningId();

					const today = new Date();

					await tx.insert(commissionProduct).values(
						products.map((_, idx) => ({
							saleItemId: products[idx].product,
							staffId: products[idx].staff,
							amount:
								Number(getCommission(fetchedProducts, Number(products[idx].product))) *
								Number(products[idx].noofproducts),
							commissionDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);

					await tx.insert(tipsProduct).values(
						products.map((_, idx) => ({
							saleItemId: products[idx].product,
							staffId: products[idx].staff,
							amount: Number(products[idx].tip) + Number(gTip),
							tipDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);

					await Promise.all(
						products.map((_, idx) =>
							tx
								.update(prds)
								.set({
									quantity: sql`${prds.quantity} - ${products[idx].noofproducts}`
								})
								.where(eq(prds.id, products[idx].product))
						)
					);
				}

				// 4. service lines
				if (services.length) {
					const txnsrvid = await tx
						.insert(transactionServices)
						.values(
							services.map((_, idx) => ({
								transactionId: txn.id,
								staffId: services[idx].staff || null,
								serviceId: services[idx].service || null,
								price: Number(getPrice(fetchedServices, Number(services[idx].service))),
								tip: services[idx].serviceTip,
								total:
									Number(getPrice(fetchedServices, Number(services[idx].service))) +
									Number(services[idx].serviceTip || 0)
							}))
						)
						.$returningId();
					const today = new Date();
					await tx.insert(commissionService).values(
						services.map((_, idx) => ({
							saleItemId: services[idx].service,
							staffId: services[idx].staff,
							amount: Number(getCommission(fetchedServices, Number(services[idx].serviceTip))),
							commissionDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);

					await tx.insert(tipsService).values(
						services.map((_, idx) => ({
							saleItemId: services[idx].service,
							staffId: services[idx].staff,
							amount: Number(services[idx].serviceTip) + Number(gTip),
							tipDate: today,
							branchId: locals.user?.branch,
							createdBy: locals.user?.id
						}))
					);
				}

				const today = new Date();

				const sumProduct = products.reduce((sum, item) => sum + item.noofproducts, 0);

				const existingReport = await tx
					.select({
						id: reports.id
					})
					.from(reports)
					.where(and(eq(reports.reportDate, sql`CURDATE()`)))
					.then((rows) => rows[0]);

				if (existingReport) {
					await tx
						.update(reports)
						.set({
							productsSold: sql<number>`${reports.productsSold} + ${sumProduct}`,
							servicesRendered: sql<number>`${reports.servicesRendered} + ${services.length}`,
							dailyIncome: sql`${sql`IFNULL(${reports.dailyIncome}, 0)`} + ${total}`,
							transactions: sql<number>`${reports.transactions} + 1`
						})
						.where(and(eq(reports.id, existingReport.id)));
				} else {
					await tx.insert(reports).values({
						reportDate: today,
						productsSold: sumProduct,
						servicesRendered: services.length,
						dailyIncome: total,
						transactions: 1
					});
				}
			});

			return message(form, { type: 'success', text: 'New Sale Successfully Added' });
		} catch (e) {
			console.error(e?.message);
			return message(form, { type: 'error', text: 'Error ' + e?.message });
		}
	}
};

function getPrice(list: Array<{ value: number; price: string }>, value: number): number {
	const item = list.find((i) => i.value === value);
	return item ? Number(item.price) : 0;
}

function getCommission(
	list: Array<{ value: number; price: string; commissionPct: string | null }>,
	value: number
): number {
	const item = list.find((i) => i.value === value);
	if (!item) return 0;

	const fixedCommissionAmount = Number(item.commissionPct ?? 0);
	return fixedCommissionAmount;
}
