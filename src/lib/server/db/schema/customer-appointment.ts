// customers-appointments.ts - Handles customers, appointments, and statuses (suggested new category for operations/client management)
import { relations, sql } from 'drizzle-orm';
import {
	mysqlTable,
	mysqlEnum,
	varchar,
	text,
	int,
	date,
	time,
    check,
    decimal,
    index,
    uniqueIndex
} from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';
import { services } from './services';
import { user } from './user';
import { transactions } from './finance';



export const customers = mysqlTable('customers', {
	id: int('id').primaryKey().autoincrement(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }),
    phone: varchar('phone', { length: 50 }).notNull().unique(),
	gender: mysqlEnum('gender', ["male", "female"]).default('female'),
	address: text('address'), 
	...secureFields
}, (table) => [
  index("first_name_idx").on(table.firstName),
  index("last_name_idx").on(table.lastName),
  uniqueIndex("phone_idx").on(table.phone),
]);

export const customerContacts = mysqlTable('customerContacts', {
		id: int('id').primaryKey().autoincrement(),
        customerId: int('customer_id')
			.notNull()
			.references(() => customers.id),
		contactType: varchar('contact_type', {length: 50}).notNull(),
		contactDetail: varchar('contact_detail', {length: 255}).notNull(),	 
});

export const appointmentStatuses = mysqlTable('appointment_statuses', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 50 }).notNull().unique(), // e.g., 'booked', 'pending'
	description: text('description')
});

export const appointments = mysqlTable(
	'appointments',
	{
		id: int('id').primaryKey().autoincrement(),
		customerId: int('customer_id')
			.notNull()
			.references(() => customers.id),
		
		appointmentDate: date('appointment_date').notNull(),
        appointmentTime: time('appointment_time').notNull(),
		statusId: int('status_id')
			.notNull()
			.references(() => appointmentStatuses.id),
        bookingFee: decimal('booking_fee', { precision: 10, scale: 2 }),
        transactionId: int('transaction_id').references(()=> transactions.id),
		notes: text('notes'),
		...secureFields
	},
 (table) => [
        check(
            'datetime_check',
            sql`STR_TO_DATE(CONCAT(${table.appointmentDate}, ' ', ${table.appointmentTime}), '%Y-%m-%d %H:%i:%s') >= NOW()`
        )
    ]
);
export const appointmentServices = mysqlTable('appointment_services', {

   	id: int('id').autoincrement().primaryKey(),
    appointmentId: int('appointment_id')
			.notNull()
			.references(() => appointments.id),
    serviceId: int('service_id')
			.notNull()
			.references(() => services.id),
});



export const customersRelations = relations(customers, ({ many }) => ({
	appointments: many(appointments)
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
	status: one(appointmentStatuses, {
		fields: [appointments.statusId],
		references: [appointmentStatuses.id]
	}),
    appointmentServices: many(appointmentServices) // Add this line

}));

export const userRelations = relations(user, ({ many }) => ({
    appointments: many(appointments)
}));