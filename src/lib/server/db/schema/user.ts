
import {
	mysqlTable,
	varchar,
	timestamp,
	int,
	boolean,
    datetime,
    text,
} from 'drizzle-orm/mysql-core';
import { branches } from './branches';
import { relations, sql } from 'drizzle-orm';
import { secureFields } from './secureFields';

export const user = mysqlTable('user', {
    id: varchar('id', { length: 255 }).primaryKey(),
    username: varchar('username', { length: 32 }).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    roleId: int('role_id').references(() => roles.id, { onDelete: 'restrict' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`).notNull(),
    branchId: int('branch_id')
        .references(() => branches.id)
        .default(0)
});

export const session = mysqlTable('session', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    expiresAt: datetime('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`).notNull(),
});

export const roles = mysqlTable('roles', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 32 }).notNull().unique(),
    description: text('description')
});

export const permissions = mysqlTable('permissions', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull().unique(), // e.g., 'customers:create', 'reports:financial:view'
    description: text('description')
});

// 2. A join table to link roles to their permissions
export const rolePermissions = mysqlTable('role_permissions', {
    id: int('id').autoincrement().primaryKey(),
    roleId: int('role_id')
        .notNull()
        .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: int('permission_id')
        .notNull()
        .references(() => permissions.id, { onDelete: 'cascade' }),
    ...secureFields
});

export const specialPermissions = mysqlTable('special_permissions', {
    id: int('id').autoincrement().primaryKey(),
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    permissionId: int('permission_id')
        .notNull()
        .references(() => permissions.id, { onDelete: 'cascade' }),
    ...secureFields
});


export const rolesRelations = relations(roles, ({ many }) => ({
    rolePermissions: many(rolePermissions)
}));

// 4. Define relations for the new tables
export const permissionsRelations = relations(permissions, ({ many }) => ({
    rolePermissions: many(rolePermissions),
    specialPermissions: many(specialPermissions)
}));

export const specialPermissionsRelations = relations(specialPermissions, ({ one }) => ({
    user: one(user, {
        fields: [specialPermissions.userId],
        references: [user.id]
    }),
    permission: one(permissions, {
        fields: [specialPermissions.permissionId],
        references: [permissions.id]
    })
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id]
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id]
    })
}));