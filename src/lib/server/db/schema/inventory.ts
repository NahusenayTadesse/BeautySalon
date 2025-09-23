// inventory.ts - Handles products, supplies, categories, and inventory adjustments


import {
	mysqlTable,

	varchar,
	timestamp,
	text,
	int,
	decimal,

} from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';



import { user } from './user';
import { transactionProducts, transactionSupplies } from './finance';



export const supplies = mysqlTable(
	'supplies',
	{
		id: int('id').primaryKey().autoincrement(),
		itemName: varchar('item_name', { length: 255 }).notNull(),
		description: text('description'),
		quantity: int('quantity').notNull().default(0),
		unitOfMeasure: varchar('unit_of_measure', { length: 20 }),
		costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }).notNull(),
		supplier: varchar('supplier', { length: 255 }),
		reorderLevel: int('reorder_level'),
		...secureFields
	});

export const products = mysqlTable(
	'products',
	{
		id: int('id').primaryKey().autoincrement(),
		productName: varchar('product_name', { length: 255 }).notNull(),
		description: text('description'),
		categoryId: int('category_id').references(()=> productCategories.id),
		quantity: int('quantity').notNull().default(0),
		price: decimal('price', { precision: 10, scale: 2 }).notNull(),
		cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
		commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
		supplier: varchar('supplier', { length: 255 }),
		reorderLevel: int('reorder_level'),
		...secureFields
	});

export const productCategories = mysqlTable('product_categories', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description')
});

export const productAdjustments = mysqlTable('product_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	productsId: int('product_id')
		.notNull()
		.references(() => products.id),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	reason: text('reason').notNull(),
	notes: text('notes'),
	transactionId: int('transaction_id').references(() => transactionProducts.id), // Link directly to the sale that caused the adjustment
	createdAt: timestamp('created_at').defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 255 })
		.notNull()
		.references(() => user.id)
});

export const suppliesAdjustments = mysqlTable('supplies_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	suppliesId: int('product_id')
		.notNull()
		.references(() => supplies.id),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	reason: text('reason').notNull(),
	notes: text('notes'),
	transactionId: int('transaction_id').references(() => transactionSupplies.id), // Link directly to the sale that caused the adjustment
	createdAt: timestamp('created_at').defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 255 })
		.notNull()
		.references(() => user.id)
});