// staff.ts - Handles staff profiles, types, contacts, services they provide, schedules, and compensation (salaries, bonuses, commissions)
import { relations, } from 'drizzle-orm';
import {
	mysqlTable,
	mysqlEnum,
	varchar,
	datetime,
	timestamp,
	text,
	int,
	decimal,

	date,
	time
} from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';
import { user } from './user';
import { payrollRuns, transactionProducts, transactionServices } from './finance';
import { services } from './services';
import { appointments } from './customer-appointment';



export const staffTypes = mysqlTable('staff_types', {
 	id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description')

})

export const staff = mysqlTable('staff', {
	id: int('id').primaryKey().autoincrement(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	userId: int('user_id').references(() => user.id),
	email: varchar('email', { length: 255 }).unique().notNull(),
	phone: varchar('phone', { length: 50 }),
	type: int('type_id').notNull()
		.references(() =>  staffTypes.id),
	hireDate: timestamp('hire_date').notNull(),
	govtId: varchar('govt_id', {length: 255}),
	contract: varchar('contract', {length: 255}),
	terminationDate: datetime('termination_date'),
    employmentStatus: mysqlEnum('employment_status', ['active', 'on_leave', 'terminated']).default('active'),
	...secureFields

});

export const staffContacts = mysqlTable('contacts', {

		id: int('id').primaryKey().autoincrement(),
        staffId: int('staff_id')
			.notNull()
			.references(() => staff.id),
		contactType: varchar('contact_type', {length: 50}).notNull(),
		contactDetail: varchar('contact_detail', {length: 255}).notNull(),	 
});

export const salaries = mysqlTable(
	'salaries',
	{
		id: int('salary_id').primaryKey().autoincrement(),
		staffId: int('staff_id')
			.notNull()
			.references(() => staff.id),
		amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
		startDate: date('start_date').notNull(),
		endDate: date('end_date'),
		...secureFields
	});

export const bonuses = mysqlTable(
	'bonuses',
	{
		id: int('bonus_id').primaryKey().autoincrement(),
		staffId: int('staff_id')
			.notNull()
			.references(() => staff.id),
		description: varchar('description', { length: 255 }),
		amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
		bonusDate: date('bonus_date').notNull(),
		...secureFields
	});

export const commissionService = mysqlTable('commissions_services', {
    saleItemId: int('sale_item_id')
        .notNull()
        .references(() => transactionServices.id),
    staffId: int('staff_id')
        .notNull()
        .references(() => staff.id),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    commissionDate: date('commission_date').notNull(),
});

export const commissionProduct = mysqlTable('commissions_product', {
    saleItemId: int('sale_item_id')
        .notNull()
        .references(() => transactionProducts.id),
    staffId: int('staff_id')
        .notNull()
        .references(() => staff.id),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    commissionDate: date('commission_date').notNull(),
});

export const staffServices = mysqlTable('staff_services', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id, { onDelete: 'cascade' }),
	serviceId: int('service_id')
		.notNull()
		.references(() => services.id, { onDelete: 'cascade' })
});

export const deductions = mysqlTable('deductions', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id),
	payrollRunId: int('payroll_run_id').references(() => payrollRuns.id), // Link to a specific payroll run
	type: varchar('type', { length: 100 }).notNull(), // e.g., 'Income Tax', 'Pension', 'Health Insurance'
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	deductionDate: date('deduction_date').notNull(),
	...secureFields
});

export const staffSchedule = mysqlTable('staff_schedule', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id),
	shiftDate: date('shift_date').notNull(),
	startTime: time('start_time').notNull(),
	endTime: time('end_time').notNull(),
	...secureFields
});

export const staffRelations = relations(staff, ({ many }) => ({
	appointments: many(appointments)
}));

export const staffServicesRelations = relations(staffServices, ({ one }) => ({
	staff: one(staff, { fields: [staffServices.staffId], references: [staff.id] }),
	service: one(services, { fields: [staffServices.serviceId], references: [services.id] })
}));

export const staffScheduleRelations = relations(staffSchedule, ({ one }) => ({
	staff: one(staff, {
		fields: [staffSchedule.staffId],
		references: [staff.id]
	})
}));