ALTER TABLE `commissions_services` DROP FOREIGN KEY `commissions_services_sale_item_id_transaction_services_id_fk`;
--> statement-breakpoint
ALTER TABLE `commissions_services` ADD CONSTRAINT `commissions_services_sale_item_id_services_id_fk` FOREIGN KEY (`sale_item_id`) REFERENCES `services`(`id`) ON DELETE set null ON UPDATE no action;