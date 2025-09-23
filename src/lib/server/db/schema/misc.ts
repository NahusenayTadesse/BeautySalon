// misc.ts - Handles miscellaneous items like positions and audit logs
import {
	mysqlTable,

	varchar,
	
	timestamp,
	text,
	int,
    json,
    date,
    decimal,
	
} from 'drizzle-orm/mysql-core';
import { user } from './user';

export const positions = mysqlTable('positions', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: text('description')
});

export const auditLog = mysqlTable('audit_log', {
    id: int('id').autoincrement().primaryKey(),
    userId: varchar('user_id', { length: 255 }).references(() => user.id),
    action: varchar('action', { length: 100 }).notNull(),
    tableName: varchar('table_name', { length: 100 }).notNull(),
    recordId: varchar('record_id', { length: 255 }).notNull(),
    oldValues: json('old_values'),
    newValues: json('new_values'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    ipAddress: varchar('ip_address', { length: 45 })
}); 

export const reports = mysqlTable('audit_log', {
    id: int('id').autoincrement().primaryKey(),
    reportDate: date('report_date').notNull().unique(), 
    bookedAppointments: int('booked_appointments').default(0),
    cancelledAppointments: int('cancelled_appointments').default(0),
    productsSold: int('products_sold').notNull().default(0),
    servicesRendered: int('services_rendered').notNull(),
    dailyExpenses: decimal('daily_expenses', { precision: 10, scale: 2 }),
    dailyIncome: decimal('daily_income', { precision: 10, scale: 2 }),
    transactions: int('transactions').notNull(),
    staffPaid: int('staff_paid'),
    totalStaffPaid: decimal('total_staff_paid', {precision: 10, scale: 2}),
    staffHired: int('staff_hired'),
    staffFired: int('staff_fired'),
})
