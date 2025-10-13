CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`report_date` date NOT NULL,
	`booked_appointments` int DEFAULT 0,
	`cancelled_appointments` int DEFAULT 0,
	`products_sold` int NOT NULL DEFAULT 0,
	`services_rendered` int NOT NULL,
	`daily_expenses` decimal(10,2),
	`daily_income` decimal(10,2),
	`transactions` int NOT NULL,
	`staff_paid` int,
	`total_staff_paid` decimal(10,2),
	`staff_hired` int,
	`staff_fired` int,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `reports_report_date_unique` UNIQUE(`report_date`)
);
--> statement-breakpoint
ALTER TABLE `audit_log` DROP INDEX `audit_log_report_date_unique`;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `audit_log` ADD `action` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `table_name` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `record_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `old_values` json;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `new_values` json;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `timestamp` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_log` ADD `ip_address` varchar(45);--> statement-breakpoint
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `report_date`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `booked_appointments`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `cancelled_appointments`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `products_sold`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `services_rendered`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `daily_expenses`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `daily_income`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `transactions`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `staff_paid`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `total_staff_paid`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `staff_hired`;--> statement-breakpoint
ALTER TABLE `audit_log` DROP COLUMN `staff_fired`;