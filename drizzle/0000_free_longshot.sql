CREATE TABLE `appointment_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	CONSTRAINT `appointment_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `appointment_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`staff_id` int NOT NULL,
	`service_id` int NOT NULL,
	`appointment_date` timestamp NOT NULL,
	`status_id` int NOT NULL DEFAULT 1,
	`notes` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bonuses` (
	`bonus_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`description` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`bonus_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `bonuses_bonus_id` PRIMARY KEY(`bonus_id`)
);
--> statement-breakpoint
CREATE TABLE `branch` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`location` text,
	CONSTRAINT `branch_id` PRIMARY KEY(`id`),
	CONSTRAINT `branch_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `commissions` (
	`commission_id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`service_id` int,
	`sale_items_id` int,
	`product_id` int,
	`amount` decimal(10,2) NOT NULL,
	`commission_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `commissions_commission_id` PRIMARY KEY(`commission_id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`address` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `deductions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`payroll_run_id` int,
	`type` varchar(100) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`deduction_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `deductions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expense_date` date NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`amount` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pay_period_start` date NOT NULL,
	`pay_period_end` date NOT NULL,
	`payment_date` date NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `payroll_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` text,
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_adjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`adjustment` int NOT NULL,
	`reason` text NOT NULL,
	`notes` text,
	`sale_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	CONSTRAINT `product_adjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`description` text,
	`quantity` int NOT NULL DEFAULT 0,
	`price` decimal(10,2) NOT NULL,
	`cost` decimal(10,2) NOT NULL,
	`commission_amount` decimal(10,2) NOT NULL,
	`supplier` varchar(255),
	`reorder_level` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`description` text,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `salaries` (
	`salary_id` int AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `salaries_salary_id` PRIMARY KEY(`salary_id`)
);
--> statement-breakpoint
CREATE TABLE `sale_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sale_id` int NOT NULL,
	`service_id` int,
	`product_id` int,
	`quantity` int NOT NULL DEFAULT 1,
	`unit_price` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `sale_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`staff_id` int NOT NULL,
	`appointment_id` int,
	`total_amount` decimal(10,2) NOT NULL,
	`payment_method` varchar(50),
	`transaction_date` timestamp NOT NULL DEFAULT (now()),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`service_name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`duration_minutes` int NOT NULL,
	`commission_amount` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `special_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`permission_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `special_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`position_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`hire_date` timestamp NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `staff_schedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`shift_date` date NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `staff_schedule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`service_id` int NOT NULL,
	CONSTRAINT `staff_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`item_name` varchar(255) NOT NULL,
	`description` text,
	`quantity` int NOT NULL DEFAULT 0,
	`unit_of_measure` varchar(20),
	`cost_per_unit` decimal(10,2) NOT NULL,
	`supplier` varchar(255),
	`reorder_level` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255) NOT NULL,
	`updated_by` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `supplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplies_adjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`adjustment` int NOT NULL,
	`reason` text NOT NULL,
	`notes` text,
	`sale_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`created_by` varchar(255) NOT NULL,
	CONSTRAINT `supplies_adjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`username` varchar(32) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`staff_id` int NOT NULL,
	`role_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`branch_id` int NOT NULL DEFAULT 0,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_status_id_appointment_statuses_id_fk` FOREIGN KEY (`status_id`) REFERENCES `appointment_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_employee_id_staff_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_sale_items_id_sale_items_id_fk` FOREIGN KEY (`sale_items_id`) REFERENCES `sale_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions` ADD CONSTRAINT `commissions_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_payroll_run_id_payroll_runs_id_fk` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD CONSTRAINT `payroll_runs_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD CONSTRAINT `payroll_runs_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD CONSTRAINT `payroll_runs_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_adjustments` ADD CONSTRAINT `product_adjustments_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_adjustments` ADD CONSTRAINT `product_adjustments_sale_id_sales_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_adjustments` ADD CONSTRAINT `product_adjustments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_employee_id_staff_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_sale_id_sales_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_items` ADD CONSTRAINT `sale_items_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_appointment_id_appointments_id_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales` ADD CONSTRAINT `sales_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff` ADD CONSTRAINT `staff_position_id_positions_id_fk` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff` ADD CONSTRAINT `staff_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff` ADD CONSTRAINT `staff_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff` ADD CONSTRAINT `staff_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies` ADD CONSTRAINT `supplies_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies` ADD CONSTRAINT `supplies_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies` ADD CONSTRAINT `supplies_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_product_id_supplies_id_fk` FOREIGN KEY (`product_id`) REFERENCES `supplies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_sale_id_sales_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_branch_id_branch_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON DELETE no action ON UPDATE no action;