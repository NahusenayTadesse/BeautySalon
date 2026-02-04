// customers-appointments.ts - Handles customers, appointments, and statuses (suggested new category for operations/client management)
import { relations } from 'drizzle-orm';
import {
	mysqlTable,
	mysqlEnum,
	varchar,
	int,
	date,
	time,
	decimal,
	index
} from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';
import { services } from './services';
import { user } from './user';

export const customers = mysqlTable(
	'customers',
	{
		id: int('id').primaryKey().autoincrement(),
		firstName: varchar('first_name', { length: 255 }).notNull(),
		lastName: varchar('last_name', { length: 255 }),
		phone: varchar('phone', { length: 50 }).notNull().unique(),
		gender: mysqlEnum('gender', ['male', 'female']).default('female'),
		address: varchar('address', { length: 255 }),
		...secureFields
	},
	(table) => [
		index('first_name_idx').on(table.firstName),
		index('last_name_idx').on(table.lastName)
	]
);

export const customerContacts = mysqlTable('customer_contacts', {
	id: int('id').primaryKey().autoincrement(),
	customerId: int('customer_id')
		.notNull()
		.references(() => customers.id, { onDelete: 'cascade' }),
	contactType: varchar('contact_type', { length: 50 }).notNull(),
	contactDetail: varchar('contact_detail', { length: 255 }).notNull(),
	...secureFields
});

export const appointmentStatuses = mysqlTable('appointment_statuses', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 50 }).notNull().unique(), // e.g., 'booked', 'pending'
	description: varchar('description', { length: 255 }),
	...secureFields
});

export const appointments = mysqlTable('appointments', {
	id: int('id').primaryKey().autoincrement(),
	customerId: int('customer_id')
		.notNull()
		.references(() => customers.id, { onDelete: 'cascade' }),

	appointmentDate: date('appointment_date').notNull(),
	appointmentTime: time('appointment_time').notNull(),
	status: mysqlEnum('status', ['pending', 'completed', 'cancelled']),
	bookingFee: decimal('booking_fee', { precision: 10, scale: 2 }),
	notes: varchar('', { length: 255 }),
	...secureFields
});
export const appointmentServices = mysqlTable('appointment_services', {
	id: int('id').autoincrement().primaryKey(),
	appointmentId: int('appointment_id')
		.notNull()
		.references(() => appointments.id, { onDelete: 'cascade' }),
	serviceId: int('service_id')
		.notNull()
		.references(() => services.id, { onDelete: 'cascade' })
});

export const customersRelations = relations(customers, ({ many }) => ({
	appointments: many(appointments)
}));

export const servicesRelations = relations(services, ({ many }) => ({
	appointmentServices: many(appointmentServices) // join table
}));

export const appointmentServicesRelations = relations(appointmentServices, ({ one }) => ({
	appointment: one(appointments, {
		fields: [appointmentServices.appointmentId],
		references: [appointments.id]
	}),
	service: one(services, {
		fields: [appointmentServices.serviceId],
		references: [services.id]
	})
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
	customer: one(customers, {
		fields: [appointments.customerId],
		references: [customers.id]
	}),
	user: one(user, {
		fields: [appointments.createdBy],
		references: [user.id]
	}),

	appointmentServices: many(appointmentServices) // Add this line
}));

export const userRelations = relations(user, ({ many }) => ({
	appointments: many(appointments)
}));
