// finance.ts - Handles sales, expenses, payroll, and other money-related transactions
import { relations } from 'drizzle-orm';
import {
	mysqlTable,
	mysqlEnum,
	varchar,
	text,
	int,
	decimal,
	date,
} from 'drizzle-orm/mysql-core';
import { appointments, customers } from './customer-appointment';
import { staff } from './staff';
import { secureFields } from './secureFields';
import { services } from './services';
import { products } from './inventory';
import { supplies } from '../schema';


export const paymentMethods = mysqlTable('payment_methods', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull().unique(), 
  description: text('description')
});



export const transactions = mysqlTable('transactions', {
  id: int('id').primaryKey().autoincrement(),
  staffId: int('staff_id').references(()=>staff.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum('payment_status', ['pending', 'paid', 'refunded']).default('pending'),
  paymentMethodId: int('payment_method_id').references(() => paymentMethods.id),  
  recieptLink: varchar('reciept_link', {length: 255}),
    ...secureFields
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    paymentMethod: one(paymentMethods, {
    fields: [transactions.paymentMethodId],
    references: [paymentMethods.id]
  }),

}));

export const transactionServices = mysqlTable('transaction_services', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').references(() => customers.id),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id),
  serviceId: int('service_id')
    .notNull()
    .references(() => services.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  tip: decimal('tip', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: int('discount').default(0),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).default(''),
  
});




export const transactionProducts = mysqlTable('transaction_products', {
  id: int('id').primaryKey().autoincrement(),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id),
  tip: decimal('tip', { precision: 10, scale: 2 }).notNull().default('0'),
  productId: int('product_id')
    .notNull().references(()=>products.id),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default('1'),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), 
});

export const transactionSupplies = mysqlTable('transaction_supplies', {
  id: int('id').primaryKey().autoincrement(),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id),
  supplyId: int('supply_id')
    .notNull().references(()=>supplies.id), 
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), 
});

export const transactionBookingFee = mysqlTable('transaction_supplies', {
  id: int('id').primaryKey().autoincrement(),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id),
  appointmentId: int('appointment_id')
    .notNull().references(()=>appointments.id), // you’ll need a products table
   fee: decimal('fee', { precision: 10, scale: 2 }).notNull(), 
});




export const expenses = mysqlTable('expenses', {
	id: int('id').autoincrement().primaryKey(),
	expenseDate: date('expense_date').notNull(),
	type: int('type').notNull().references(()=> expensesType.id), // e.g., 'Rent', 'Utilities', 'Marketing', 'Supplies'
	description: text('description'),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
      transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id),
});

export const expensesType = mysqlTable('expenses_type', {
     	id: int('id').autoincrement().primaryKey(),
        name: varchar('name', {length: 255}).notNull().unique(),
        description: text('description'),
})



export const payrollRuns = mysqlTable('payroll_runs', {
	id: int('id').autoincrement().primaryKey(),
	payPeriodStart: date('pay_period_start').notNull(),
	payPeriodEnd: date('pay_period_end').notNull(),
	paymentDate: date('payment_date').notNull(),
	status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed'])
		.notNull()
		.default('pending'),
	
    totalNet: decimal('total_net', { precision: 10, scale: 2 }),
    totalDeductions: decimal('total_deductions', { precision: 10, scale: 2 }),
	totalPaid: decimal('total_paid', { precision: 10, scale: 2 }),
	...secureFields
});

export const payrollEntries = mysqlTable('payroll_entries', {
    payrollRunId: int('payroll_run_id').references(() => payrollRuns.id),
    staffId: int('staff_id').references(() => staff.id),
    netAmount: decimal('net_amount', { precision: 10, scale: 2 }),
    paidAmount: decimal('paid_amount', { precision: 10, scale: 2 }),
    paymentMethodId: int('payment_method_id').references(() => paymentMethods.id),  
     recieptLink: varchar('reciept_link', {length: 255}),
     ...secureFields
});

export const transactionRelations = relations(transactions, ({ one, many }) => ({
	
	staff: one(staff, {
		fields: [transactions.staffId],
		references: [staff.id],
	}),
	transactionProductss: many(transactionProducts), // this will be connected via saleId
	transactionServices: many(transactionServices), // this will be connected via saleId
}));

export const transactionProductsRelations = relations(transactionProducts, ({ one }) => ({
	sale: one(transactions, {
		fields: [transactionProducts.transactionId],
		references: [transactions.id],
	}),
	product: one(products, {
		fields: [transactionProducts.productId],
		references: [products.id],
	}),
}));


export const transactionServicessRelations = relations(transactionServices, ({ one }) => ({
	sale: one(transactions, {
		fields: [transactionServices.transactionId],
		references: [transactions.id],
	}),
	service: one(services, {
		fields: [transactionServices.serviceId],
		references: [services.id],
	}),
}));