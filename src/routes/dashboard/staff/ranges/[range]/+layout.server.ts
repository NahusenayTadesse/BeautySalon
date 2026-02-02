import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	products,
	services,
	staff,
	staffSchedule,
	staffTypes,
	tipsProduct,
	transactionProducts,
	transactionServices,
	user
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { tipsService } from '$lib/server/db/schema';
import { addSchedule, editSchedule } from './schema';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { range } = params;

	const id = range.split('-').pop();

	const form = await superValidate(zod4(schema));
	const add = await superValidate(zod4(addSchedule));
	const edit = await superValidate(zod4(editSchedule));

	const staffMember = await db
		.select({
			id: staff.id,
			firstName: staff.firstName,
			lastName: staff.lastName,
			category: staffTypes.name,
			categoryId: staffTypes.id,
			phone: staff.phone,
			email: staff.email,
			status: staff.employmentStatus,
			hireDate: sql<string>`DATE_FORMAT(${staff.hireDate}, '%Y-%m-%d')`,
			govId: staff.govtId,
			contract: staff.contract,

			addedBy: user.name,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${staff.hireDate}, CURDATE())`
		})
		.from(staff)
		.leftJoin(staffTypes, eq(staff.type, staffTypes.id))
		.leftJoin(user, eq(staff.createdBy, user.id))
		.where(and(eq(staff.branchId, Number(locals?.user?.branch)), eq(staff.id, Number(id))))
		.then((rows) => rows[0]);

	const today = new Date().toISOString().split('T')[0];
	const serviceTipsToday = await db
		.select({
			staffId: tipsService.staffId,
			service: services.name,
			amount: tipsService.amount,
			date: tipsService.tipDate
		})
		.from(tipsService)
		.leftJoin(transactionServices, eq(tipsService.saleItemId, transactionServices.id))
		.leftJoin(services, eq(transactionServices.serviceId, services.id))

		.where(and(eq(tipsService.staffId, Number(id)), eq(tipsService.tipDate, today)));

	const productTipsToday = await db
		.select({
			staffId: tipsProduct.staffId,
			product: products.name,
			amount: tipsProduct.amount,
			date: tipsProduct.tipDate
		})
		.from(tipsProduct)
		.leftJoin(transactionProducts, eq(tipsProduct.saleItemId, transactionProducts.id))
		.leftJoin(products, eq(transactionProducts.productId, products.id))

		.where(and(eq(tipsProduct.staffId, Number(id)), eq(tipsProduct.tipDate, new Date(today))));

	const categories = await db
		.select({
			value: staffTypes.id,
			name: staffTypes.name,
			description: staffTypes.description
		})
		.from(staffTypes);

	const schedules = await db
		.select({
			id: staffSchedule.id,
			day: staffSchedule.weekDay,
			startTime: staffSchedule.startTime,
			endTime: staffSchedule.endTime,
			status: staffSchedule.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(staffSchedule)
		.leftJoin(user, eq(staffSchedule.createdBy, user.id))
		.where(eq(staffSchedule.staffId, Number(id)));

	return {
		staffMember,
		form,
		categories,
		productTipsToday,
		serviceTipsToday,
		add,
		edit,
		schedules
	};
};
