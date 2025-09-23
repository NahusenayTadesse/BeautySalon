// services.ts - Handles services and their categories (suggested new category for service offerings)
import { relations, sql } from 'drizzle-orm';
import {
	mysqlTable,
	varchar,
	datetime,
	timestamp,
	text,
	int,
	decimal,
	boolean,
	
} from 'drizzle-orm/mysql-core';
import { user } from './user';
import { branches } from './branches';
import { appointments } from './customer-appointment';
import { uniqueIndex } from 'drizzle-orm/mysql-core';

const secureFields = {
	isActive: boolean('is_active').default(true).notNull(),
	createdBy: varchar('created_by', { length: 255 })
		.references(() => user.id),
	updatedBy: varchar('updated_by', { length: 255 })
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`).notNull(),
	branchId: int('branch_id')
		.references(() => branches.id)
		.default(0),
    deletedAt: datetime('deleted_at'),
    deletedBy: varchar('deleted_by', { length: 255 })
        .references(() => user.id),
};

export const serviceCategories = mysqlTable('service_categories', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
	...secureFields
});

export const services = mysqlTable(
	'services',
	{
		id: int('id').primaryKey().autoincrement(),
		serviceName: varchar('service_name', { length: 255 }).notNull().unique(),
		categoryId: int('category_id').references(()=> serviceCategories.id),
		description: text('description'),
		price: decimal('price', { precision: 10, scale: 2 }).notNull(),
		durationMinutes: int('duration_minutes').notNull(),
		commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
		...secureFields
	}, (table) => [
	  uniqueIndex("service_name_idx").on(table.serviceName),
	]);

export const servicesRelations = relations(services, ({ many }) => ({
	appointments: many(appointments)
}));