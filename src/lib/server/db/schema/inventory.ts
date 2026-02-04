// inventory.ts - Handles products, supplies, categories, and inventory adjustments

import { mysqlTable, varchar, int, decimal, boolean } from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';

import { transactions, transactionSupplies } from './finance';
import { staff } from './staff';

export const products = mysqlTable('products', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 }),
	categoryId: int('category_id').references(() => productCategories.id, { onDelete: 'set null' }),
	quantity: int('quantity').notNull().default(0),
	price: decimal('price', { precision: 10, scale: 2 }).notNull(),
	cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
	commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
	supplierId: int('supplier_id').references(() => productSuppliers.id),
	reorderLevel: int('reorder_level'),
	...secureFields
});

export const productCategories = mysqlTable('product_categories', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 50 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
	...secureFields
});

export const productAdjustments = mysqlTable('product_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	productsId: int('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	supplierId: int('supplier_id').references(() => productSuppliers.id),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	reason: varchar('reason', { length: 255 }),
	transactionId: int('transaction_id').references(() => transactions.id), // Link directly to the sale that caused the adjustment
	...secureFields
});

export const damagedProducts = mysqlTable('damaged_products', {
	id: int('id').primaryKey().autoincrement(),
	productId: int('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	quantity: int('quantity').notNull(),
	damagedBy: int('damaged_by').references(() => staff.id, { onDelete: 'set null' }),
	deductable: boolean('deductable').notNull().default(false),
	reason: varchar('reason', { length: 255 }).notNull(),
	...secureFields
});

export const supplyTypes = mysqlTable('supply_types', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 })
});

export const supplies = mysqlTable('supplies', {
	id: int('id').primaryKey().autoincrement(),
	supplyTypeId: int('supply_type_id')
		.notNull()
		.references(() => supplyTypes.id),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 }),
	quantity: int('quantity').notNull().default(0),
	unitOfMeasure: varchar('unit_of_measure', { length: 20 }),
	reorderLevel: int('reorder_level'),
	...secureFields
});

export const damagedSupplies = mysqlTable('damaged_supplies', {
	id: int('id').primaryKey().autoincrement(),
	supplyId: int('supply_id')
		.notNull()
		.references(() => supplies.id, { onDelete: 'cascade' }),
	quantity: int('quantity').notNull(),
	damagedBy: int('damaged_by').references(() => staff.id, { onDelete: 'set null' }),
	deductable: boolean('deductable').notNull().default(false),
	reason: varchar('reason', { length: 255 }).notNull(),
	...secureFields
});

export const suppliesAdjustments = mysqlTable('supplies_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	suppliesId: int('supplies_id')
		.notNull()
		.references(() => supplies.id, { onDelete: 'cascade' }),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	supplierId: int('supplier_id').references(() => supplySuppliers.id),
	employeeResponsible: int('employee_responsible').references(() => staff.id),
	reason: varchar('reason', { length: 255 }),
	costPerItem: decimal('cost_per_item', { precision: 10, scale: 2 }),
	total: decimal('total', { precision: 10, scale: 2 }),
	transactionId: int('transaction_id').references(() => transactionSupplies.id, {
		onDelete: 'set null'
	}), //if the adjustment is caused by new stuff coming in
	damagedSuppliesId: int('damaged_supplies_id').references(() => damagedSupplies.id, {
		onDelete: 'set null'
	}),
	...secureFields
});

export const supplySuppliers = mysqlTable('supply_suppliers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	email: varchar('email', { length: 100 }),
	description: varchar('description', { length: 255 }),
	...secureFields
});

export const productSuppliers = mysqlTable('product_suppliers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	email: varchar('email', { length: 100 }),
	description: varchar('description', { length: 255 }),
	...secureFields
});
