import { mysqlTable, varchar, datetime } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	username: varchar('username', { length: 32 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull()
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, {onDelete: 'cascade'}),
	expiresAt: datetime('expires_at').notNull()
});


// ========== CUSTOMERS ==========
// Stores information about salon clients. Customers are not system users.
// export const customers = mysqlTable('customers', {
//   id: serial('id').primaryKey(),
//   firstName: varchar('first_name', { length: 100 }).notNull(),
//   lastName: varchar('last_name', { length: 100 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull(),
//   phone: varchar('phone', { length: 20 }).notNull(),
//   notes: text('notes'), // For allergies, preferences, etc.
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').onUpdateNow(),
// }, (table) => ({
//   emailIdx: uniqueIndex('email_idx').on(table.email),
//   phoneIdx: uniqueIndex('phone_idx').on(table.phone),
// }));

// export const customersRelations = relations(customers, ({ many }) => ({
//   appointments: many(appointments),
// }));


// ========== STAFF & USERS ==========
// Staff are employees. Some staff members are also Users with system access.

// Roles for system users (e.g., admin, stylist, receptionist)
// export const roles = mysqlTable('roles', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 50 }).notNull().unique(),
//     description: text('description'),
// });

// export const rolesRelations = relations(roles, ({ many }) => ({
//     users: many(users),
// }));

// All employees of the salon
// export const staff = mysqlTable('staff', {
//   id: serial('id').primaryKey(),
//   firstName: varchar('first_name', { length: 100 }).notNull(),
//   lastName: varchar('last_name', { length: 100 }).notNull(),
//   email: varchar('email', { length: 255 }).notNull(),
//   phone: varchar('phone', { length: 20 }).notNull(),
//   position: varchar('position', { length: 100 }), // e.g., 'Senior Stylist', 'Manager'
//   hireDate: timestamp('hire_date').notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').onUpdateNow(),
// }, (table) => ({
//   emailIdx: uniqueIndex('staff_email_idx').on(table.email),
// }));

// export const staffRelations = relations(staff, ({ one, many }) => ({
//     user: one(users), // One-to-one relationship with users
//     appointments: many(appointments),
// }));

// System users who can log in. Every user MUST be a staff member.
// export const users = mysqlTable('users', {
//     id: serial('id').primaryKey(),
//     staffId: int('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
//     roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
//     username: varchar('username', { length: 100 }).notNull().unique(),
//     passwordHash: varchar('password_hash', { length: 255 }).notNull(),
//     isActive: boolean('is_active').default(true).notNull(),
//     lastLogin: timestamp('last_login'),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
//     updatedAt: timestamp('updated_at').onUpdateNow(),
// }, (table) => ({
//     staffIdIdx: uniqueIndex('user_staff_id_idx').on(table.staffId), // Enforces one-to-one
// }));

// export const usersRelations = relations(users, ({ one }) => ({
//     staff: one(staff, {
//         fields: [users.staffId],
//         references: [staff.id],
//     }),
//     role: one(roles, {
//         fields: [users.roleId],
//         references: [roles.id],
//     }),
// }));


// // ========== SERVICES ==========
// // Defines the services offered by the salon.
// export const services = mysqlTable('services', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 255 }).notNull(),
//   description: text('description'),
//   duration: int('duration').notNull(), // Duration in minutes
//   price: decimal('price', { precision: 10, scale: 2 }).notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const servicesRelations = relations(services, ({ many }) => ({
//     appointmentServices: many(appointmentServices),
//     productUsage: many(productUsage),
// }));


// // ========== APPOINTMENTS ==========
// // Manages the scheduling of appointments.
// export const appointments = mysqlTable('appointments', {
//   id: serial('id').primaryKey(),
//   customerId: int('customer_id').notNull().references(() => customers.id),
//   staffId: int('staff_id').notNull().references(() => staff.id),
//   startTime: timestamp('start_time').notNull(),
//   endTime: timestamp('end_time').notNull(),
//   status: mysqlEnum('status', ['scheduled', 'completed', 'cancelled', 'no-show']).default('scheduled').notNull(),
//   notes: text('notes'), // Appointment-specific notes
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
//   customer: one(customers, {
//     fields: [appointments.customerId],
//     references: [customers.id],
//   }),
//   staff: one(staff, {
//     fields: [appointments.staffId],
//     references: [staff.id],
//   }),
//   appointmentServices: many(appointmentServices),
// }));

// // Junction table: links appointments to the specific services performed.
// // An appointment can consist of multiple services.
// export const appointmentServices = mysqlTable('appointment_services', {
//     id: serial('id').primaryKey(),
//     appointmentId: int('appointment_id').notNull().references(() => appointments.id, { onDelete: 'cascade' }),
//     serviceId: int('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
// });

// export const appointmentServicesRelations = relations(appointmentServices, ({ one }) => ({
//     appointment: one(appointments, {
//         fields: [appointmentServices.appointmentId],
//         references: [appointments.id],
//     }),
//     service: one(services, {
//         fields: [appointmentServices.serviceId],
//         references: [services.id],
//     }),
// }));


// // ========== INVENTORY ==========
// // Manages products for professional use and retail.
// export const suppliers = mysqlTable('suppliers', {
//     id: serial('id').primaryKey(),
//     name: varchar('name', { length: 255 }).notNull(),
//     contactPerson: varchar('contact_person', { length: 255 }),
//     email: varchar('email', { length: 255 }),
//     phone: varchar('phone', { length: 50 }),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
// });

// export const suppliersRelations = relations(suppliers, ({ many }) => ({
//     products: many(products),
// }));

// export const products = mysqlTable('products', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 255 }).notNull(),
//   sku: varchar('sku', { length: 100 }).unique(),
//   brand: varchar('brand', { length: 100 }),
//   description: text('description'),
//   costPrice: decimal('cost_price', { precision: 10, scale: 2 }), // Price from supplier
//   retailPrice: decimal('retail_price', { precision: 10, scale: 2 }), // Price for customers
//   quantityInStock: int('quantity_in_stock').notNull().default(0),
//   reorderLevel: int('reorder_level'), // Threshold to reorder stock
//   supplierId: int('supplier_id').references(() => suppliers.id, { onDelete: 'set null' }),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').onUpdateNow(),
// });

// export const productsRelations = relations(products, ({ one, many }) => ({
//     supplier: one(suppliers, {
//         fields: [products.supplierId],
//         references: [suppliers.id],
//     }),
//     productUsage: many(productUsage),
// }));

// // Junction table: tracks which products and how much are used for each service.
// export const productUsage = mysqlTable('product_usage', {
//     id: serial('id').primaryKey(),
//     serviceId: int('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
//     productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
//     quantityUsed: decimal('quantity_used', { precision: 10, scale: 2 }).notNull(), // e.g., 10 (ml), 0.5 (tube)
//     unit: varchar('unit', { length: 20 }), // e.g., 'ml', 'g', 'pump', 'unit'
// });

// export const productUsageRelations = relations(productUsage, ({ one }) => ({
//     service: one(services, {
//         fields: [productUsage.serviceId],
//         references: [services.id],
//     }),
//     product: one(products, {
//         fields: [productUsage.productId],
//         references: [products.id],
//     }),
// }));


export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
