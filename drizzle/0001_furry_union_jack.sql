ALTER TABLE `products` ADD `supplier_id` int;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_supplier_id_product_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `product_suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `supplier`;