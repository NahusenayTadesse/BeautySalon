import { relations } from 'drizzle-orm';
import { mysqlTable, varchar, datetime, timestamp, text, int, decimal, boolean } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	username: varchar('username', { length: 32 }).notNull().unique(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	staffId: int('staff_id').notNull().references(() => staff.id, { onDelete: 'cascade' }),
    roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Table for Staff
export const staff = mysqlTable('staff', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 50 }),
  hireDate: timestamp('hire_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inventory = mysqlTable('inventory', {
  id: int('id').primaryKey().autoincrement(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  description: text('description'),
  quantity: int('quantity').notNull().default(0),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  supplier: varchar('supplier', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
  status: varchar('status', { length: 50 }).notNull().default('booked'), // e.g., 'booked', 'completed', 'cancelled'
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



export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
