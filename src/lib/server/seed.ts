// src/lib/server/seed.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '$lib/server/db/schema/';
const DB_URL = "mysql://root:@localhost:3306/salon2";

if (!DB_URL) throw new Error('DATABASE_URL is not set');

const client = mysql.createPool(DB_URL);

 const db = drizzle(client, { schema, mode: 'default' });
import { hash } from '@node-rs/argon2';
import { extractUsername, generateUserId } from '$lib/global.svelte';
import { roles, user } from './db/schema/user';
import { permissions, rolePermissions } from './db/schema/permissions';
import { branches } from '$lib/server/db/schema/branches';

import { eq } from 'drizzle-orm';

async function seed() {


  /* ---------- 1. Permissions ---------- */
  const permissionData = [
  { name: "branches:view", description: "View branch details and lists" },
  { name: "branches:create", description: "Create new branches" },
  { name: "branches:update", description: "Update existing branch information" },
  { name: "branches:delete", description: "Delete branches (soft delete)" },
  { name: "users:view", description: "View user accounts and details" },
  { name: "users:create", description: "Create new user accounts" },
  { name: "users:update", description: "Update user account information (e.g., roles, passwords)" },
  { name: "users:delete", description: "Delete or deactivate user accounts" },
  { name: "roles:view", description: "View roles and their assigned permissions" },
  { name: "roles:create", description: "Create new roles" },
  { name: "roles:update", description: "Update role details and permissions" },
  { name: "roles:delete", description: "Delete roles" },
  { name: "permissions:view", description: "View available permissions in the system" },
  { name: "permissions:assign", description: "Assign special permissions to individual users" },
  { name: "customers:view", description: "View customer profiles and lists" },
  { name: "customers:create", description: "Create new customer profiles" },
  { name: "customers:update", description: "Update customer information" },
  { name: "customers:delete", description: "Delete or archive customer profiles" },
  { name: "staff:view", description: "View staff profiles and lists" },
  { name: "staff:create", description: "Hire new staff (create profiles)" },
  { name: "staff:update", description: "Update staff information (e.g., positions, contracts)" },
  { name: "staff:delete", description: "Terminate or delete staff profiles" },
  { name: "staff:schedules:view", description: "View staff schedules and shifts" },
  { name: "staff:schedules:create", description: "Create new staff schedules" },
  { name: "staff:schedules:update", description: "Update existing staff schedules" },
  { name: "staff:schedules:delete", description: "Delete staff schedules" },
  { name: "staff:services:view", description: "View services assigned to staff" },
  { name: "staff:services:assign", description: "Assign or update services that staff can perform" },
  { name: "supplies:view", description: "View supplies inventory and details" },
  { name: "supplies:create", description: "Add new supply items" },
  { name: "supplies:update", description: "Update supply item details (e.g., cost, supplier)" },
  { name: "supplies:delete", description: "Delete supply items" },
  { name: "supplies:adjust", description: "Adjust supply quantities (e.g., restock, usage)" },
  { name: "products:view", description: "View product inventory and details" },
  { name: "products:create", description: "Add new products" },
  { name: "products:update", description: "Update product details (e.g., price, cost)" },
  { name: "products:delete", description: "Delete products" },
  { name: "products:adjust", description: "Adjust product quantities (e.g., restock, sales)" },
  { name: "product_categories:view", description: "View product categories" },
  { name: "product_categories:create", description: "Create new product categories" },
  { name: "product_categories:update", description: "Update product categories" },
  { name: "product_categories:delete", description: "Delete product categories" },
  { name: "service_categories:view", description: "View service categories" },
  { name: "service_categories:create", description: "Create new service categories" },
  { name: "service_categories:update", description: "Update service categories" },
  { name: "service_categories:delete", description: "Delete service categories" },
  { name: "services:view", description: "View services and details" },
  { name: "services:create", description: "Add new services" },
  { name: "services:update", description: "Update service details (e.g., price, duration)" },
  { name: "services:delete", description: "Delete services" },
  { name: "appointments:view", description: "View appointments and calendars" },
  { name: "appointments:book", description: "Book new appointments" },
  { name: "appointments:update", description: "Update appointment details (e.g., time, staff)" },
  { name: "appointments:cancel", description: "Cancel or delete appointments" },
  { name: "appointment_statuses:view", description: "View appointment status options" },
  { name: "appointment_statuses:manage", description: "Manage (create/update/delete) appointment statuses" },
  { name: "positions:view", description: "View staff positions" },
  { name: "positions:create", description: "Create new positions" },
  { name: "positions:update", description: "Update position details" },
  { name: "positions:delete", description: "Delete positions" },
  { name: "salaries:view", description: "View staff salary information" },
  { name: "salaries:create", description: "Set or create new salary records" },
  { name: "salaries:update", description: "Update salary amounts or dates" },
  { name: "salaries:delete", description: "Delete salary records" },
  { name: "bonuses:view", description: "View staff bonus records" },
  { name: "bonuses:create", description: "Award new bonuses" },
  { name: "bonuses:update", description: "Update bonus details" },
  { name: "bonuses:delete", description: "Delete bonus records" },
  { name: "commissions:view", description: "View commission records" },
  { name: "commissions:create", description: "Record new commissions" },
  { name: "commissions:update", description: "Update commission amounts" },
  { name: "commissions:delete", description: "Delete commission records" },
  { name: "deductions:view", description: "View staff deduction records" },
  { name: "deductions:create", description: "Add new deductions" },
  { name: "deductions:update", description: "Update deduction details" },
  { name: "deductions:delete", description: "Delete deductions" },
  { name: "sales:view", description: "View sales transactions and details" },
  { name: "sales:process", description: "Process new sales (create transactions)" },
  { name: "sales:update", description: "Update sale details (e.g., items, amounts)" },
  { name: "sales:delete", description: "Delete or refund sales" },
  { name: "sale_items:view", description: "View items within sales (typically included in sales:view)" },
  { name: "expenses:view", description: "View expense records" },
  { name: "expenses:create", description: "Record new expenses" },
  { name: "expenses:update", description: "Update expense details" },
  { name: "expenses:delete", description: "Delete expenses" },
  { name: "payroll:view", description: "View payroll runs and entries" },
  { name: "payroll:run", description: "Initiate and process payroll runs" },
  { name: "payroll:update", description: "Update payroll details (e.g., amounts, status)" },
  { name: "payroll:delete", description: "Delete or cancel payroll runs" },
  { name: "audit:view", description: "View audit logs for system actions" },
  { name: "reports:sales:view", description: "View sales reports and analytics" },
  { name: "reports:financial:view", description: "View financial reports (e.g., income, expenses)" },
  { name: "reports:inventory:view", description: "View inventory reports (supplies and products)" },
  { name: "reports:appointments:view", description: "View appointment and scheduling reports" },
  { name: "reports:staff:performance:view", description: "View staff performance reports (e.g., commissions, productivity)" },
  { name: "system:settings:view", description: "View system-wide settings (e.g., branches, categories)" },
  { name: "system:settings:update", description: "Update system settings" },
];

const existingBranches = await db.select().from(branches).limit(1);
  if (existingBranches.length === 0){
     await db.insert(branches).values({name: "Main Branch"});
  }

  const [branch] = await db.select({id: branches.id}).from(branches).where(eq(branches.name, "Main Branch"));
 
 
const existingPermissions = await db
  .select()
  .from(permissions)
  .limit(1);

if (existingPermissions.length === 0) {
  await db.insert(permissions).values(
    permissionData.map((p) => ({
      name: p.name,
      description: p.description,
    }))
  );
}  

  

  



     const name = "System Admin";
     const description = "Can do Everything"

  /* ---------- 2. Admin role ---------- */
  const adminRole = await db
    .select()
    .from(roles)
    .limit(1); 
   
  if (adminRole.length === 0) {
     await db.insert(roles).values({ name, description });
  } 

   const [role] = await db.select({id: roles.id}).from(roles).where(eq(roles.name, "System Admin"))



  /* ---------- 3. Role-Permission links ---------- */
  const allPerms = await db.select({id: permissions.id}).from(permissions);

  await db.insert(rolePermissions).values(
           allPerms.map((p) => ({
            roleId: role.id,
            permissionId: p.id,
            branchId: branch.id
          }))
        );
  /* ---------- 4. Admin user ---------- */
   

   const adminName = "admin";
   const email = "admin@nahu.com";
   const password= "SystemAdmin123"
   const username = extractUsername(email);
  
  
  const passwordHash = await hash(password, {
              // recommended minimum parameters
              memoryCost: 19456,
              timeCost: 2,
              outputLen: 32,
              parallelism: 1
          });
     const id = generateUserId()

    await db.insert(user).values({ id, username, name: adminName, email, roleId: role.id, passwordHash, branchId: 1});
     
  
        }
  


seed()
  .then(() => {
    console.log('✅ DB seeded');
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Seeding failed', e);
    process.exit(1);
  });