ALTER TABLE `transaction_services` DROP FOREIGN KEY `transaction_services_customer_id_customers_id_fk`;
--> statement-breakpoint
ALTER TABLE `transaction_products` ADD `appointment_id` int;--> statement-breakpoint
ALTER TABLE `transaction_products` ADD CONSTRAINT `transaction_products_appointment_id_appointments_id_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` DROP COLUMN `customer_id`;