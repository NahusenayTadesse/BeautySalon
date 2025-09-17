import { relations } from 'drizzle-orm';
import { mysqlTable,mysqlEnum, varchar, datetime, timestamp, text, int, decimal, boolean, date, primaryKey } from 'drizzle-orm/mysql-core';

const secureFields = {
  isActive: boolean('is_active').default(true).notNull(), 
  createdBy: varchar('created_by', { length: 255 })
		.notNull()
		.references(() => user.id),
  updatedBy: varchar('updated_by', { length: 255 })
		.notNull()
		.references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}



export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	username: varchar('username', { length: 32 }).notNull().unique(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(), 
	staffId: int('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
  roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, {onDelete: 'cascade'}),
	expiresAt: datetime('expires_at').notNull()
});

export const roles = mysqlTable('roles', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 32 }).notNull().unique(),
    description: text('description'),
});

export const customers = mysqlTable('customers', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  ...secureFields
});

// Table for Staff

export const staff = mysqlTable('staff', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  positionId: int('position_id').notNull().references(() => positions.id),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 50 }),
  hireDate: timestamp('hire_date').notNull(),
  ...secureFields  
});

export const supplies = mysqlTable('supplies', {
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

export const products = mysqlTable('products', {
    id: int('id').primaryKey().autoincrement(),
    productName: varchar('product_name', { length: 255 }).notNull(),
    description: text('description'),
    quantity: int('quantity').notNull().default(0), 
    price: decimal('price', { precision: 10, scale: 2 }).notNull(), 
    cost: decimal('cost', { precision: 10, scale: 2 }).notNull(), 
    supplier: varchar('supplier', { length: 255 }),
    reorderLevel: int('reorder_level'), 
    ...secureFields
});

// Table for Services (e.g., Haircut, Coloring)
export const services = mysqlTable('services', {
  id: int('id').primaryKey().autoincrement(),
  serviceName: varchar('service_name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  durationMinutes: int('duration_minutes').notNull(), // Duration in minutes
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Table for Appointments
export const appointments = mysqlTable('appointments', {
  id: int('id').primaryKey().autoincrement(),
  customerId: int('customer_id').notNull().references(() => customers.id),
  staffId: int('staff_id').notNull().references(() => staff.id),
  serviceId: int('service_id').notNull().references(() => services.id),
  appointmentDate: timestamp('appointment_date').notNull(), // Use timestamp for date and time
  status: mysqlEnum('status', ['booked', 'confirmed', 'completed', 'cancelled', 'no-show']).notNull().default('booked'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations (for querying with Drizzle ORM)
// Customers relations
export const customersRelations = relations(customers, ({ many }) => ({
  appointments: many(appointments),
}));

// Staff relations
export const staffRelations = relations(staff, ({ many }) => ({
  appointments: many(appointments),
}));

// Services relations
export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

// Appointments relations
export const appointmentsRelations = relations(appointments, ({ one }) => ({
  customer: one(customers, {
    fields: [appointments.customerId],
    references: [customers.id],
  }),
  staff: one(staff, {
    fields: [appointments.staffId],
    references: [staff.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));



export const usersRelations = relations(user, ({ one }) => ({
    staff: one(staff, {
        fields: [user.staffId],
        references: [staff.id],
    }),
    role: one(roles, {
        fields: [user.roleId],
        references: [roles.id],
    }),
}));


export const positions = mysqlTable('positions', {
     id: int('id').primaryKey().autoincrement(),
     name: varchar('name', { length: 50 }).notNull(),
     description: text('description'),
});

export const salaries = mysqlTable("salaries", {
  id: int("salary_id").primaryKey().autoincrement(),
  staffId: int("employee_id")
    .notNull()
    .references(() => staff.id), // FK to employees
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), 
});


export const bonuses = mysqlTable("bonuses", {
  id: int("bonus_id").primaryKey().autoincrement(),
  staffId: int("employee_id")
    .notNull()
    .references(() => staff.id),
  description: varchar("description", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  bonusDate: date("bonus_date").notNull(),
});

export const commissions = mysqlTable("commissions", {
  id: int("commission_id").primaryKey().autoincrement(),
  staffId: int("staff_id")
    .notNull()
    .references(() => staff.id),
  serviceId: int("service_id"), 
  saleId: int("sale_id").references(() => sales.id),
  inventoryId: int("inventory_id").references(() => inventory.id),  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commissionDate: date("commission_date").notNull(),
});


// 1. A table for all possible permissions in the system
export const permissions = mysqlTable('permissions', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(), // e.g., 'customers:create', 'reports:financial:view'
    description: text('description'),
});

// 2. A join table to link roles to their permissions
export const rolePermissions = mysqlTable('role_permissions', {
      
    id: int('id').autoincrement().primaryKey(),
    roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: int('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
});

// 3. Update rolesRelations
export const rolesRelations = relations(roles, ({ many }) => ({
    rolePermissions: many(rolePermissions),
}));

// 4. Define relations for the new tables
export const permissionsRelations = relations(permissions, ({ many }) => ({
    rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id],
    }),
}));


// A central table to record every transaction
export const sales = mysqlTable('sales', {
    id: int('id').autoincrement().primaryKey(),
    customerId: int('customer_id').notNull().references(() => customers.id),
    staffId: int('staff_id').notNull().references(() => staff.id), // The staff member who processed the sale
    appointmentId: int('appointment_id').references(() => appointments.id), // Optional link to an appointment
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }), // e.g., 'cash', 'card'
    transactionDate: timestamp('transaction_date').defaultNow().notNull(),
    ...secureFields
});

// A join table to detail what was included in the sale
export const saleItems = mysqlTable('sale_items', {
    id: int('id').autoincrement().primaryKey(),
    saleId: int('sale_id').notNull().references(() => sales.id, { onDelete: 'cascade' }),
    serviceId: int('service_id').references(() => services.id),
    inventoryId: int('inventory_id').references(() => inventory.id),
    quantity: int('quantity').notNull().default(1),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), // Price at the time of sale
});

export const staffServices = mysqlTable('staff_services', {
    id: int('id').autoincrement().primaryKey(),
    staffId: int('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
    serviceId: int('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
});

export const expenses = mysqlTable('expenses', {
    id: int('id').autoincrement().primaryKey(),
    expenseDate: date('expense_date').notNull(),
    category: varchar('category', { length: 100 }).notNull(), // e.g., 'Rent', 'Utilities', 'Marketing', 'Supplies'
    description: text('description'),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    ...secureFields
});

export const inventoryAdjustments = mysqlTable('inventory_adjustments', {
    id: int('id').autoincrement().primaryKey(),
    inventoryId: int('inventory_id').notNull().references(() => inventory.id),
    adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
    reason: mysqlEnum('reason', ['sale', 'supplier_stock', 'damage', 'internal_use', 'correction']).notNull(),
    notes: text('notes'),
    saleId: int('sale_id').references(() => sales.id), // Link directly to the sale that caused the adjustment
    createdAt: timestamp('created_at').defaultNow().notNull(),
    createdBy: varchar('created_by', { length: 255 }).notNull().references(() => user.id),
});


export const payrollRuns = mysqlTable('payroll_runs', {
    id: int('id').autoincrement().primaryKey(),
    payPeriodStart: date('pay_period_start').notNull(),
    payPeriodEnd: date('pay_period_end').notNull(),
    paymentDate: date('payment_date').notNull(),
    status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed']).notNull().default('pending'),
    ...secureFields
});

export const deductions = mysqlTable('deductions', {
    id: int('id').autoincrement().primaryKey(),
    staffId: int('staff_id').notNull().references(() => staff.id),
    payrollRunId: int('payroll_run_id').references(() => payrollRuns.id), // Link to a specific payroll run
    type: varchar('type', { length: 100 }).notNull(), // e.g., 'Income Tax', 'Pension', 'Health Insurance'
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    deductionDate: date('deduction_date').notNull(),
});


export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
