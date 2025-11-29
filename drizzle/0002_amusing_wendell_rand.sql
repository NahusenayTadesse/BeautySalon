CREATE TABLE `tips_product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sale_item_id` int NOT NULL,
	`staff_id` int,
	`amount` decimal(10,2) NOT NULL,
	`tip_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`branch_id` int,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `tips_product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tips_service` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sale_item_id` int,
	`staff_id` int,
	`amount` decimal(10,2) NOT NULL,
	`tip_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`branch_id` int,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `tips_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tips_product` ADD CONSTRAINT `tips_product_sale_item_id_transaction_products_id_fk` FOREIGN KEY (`sale_item_id`) REFERENCES `transaction_products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_product` ADD CONSTRAINT `tips_product_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_product` ADD CONSTRAINT `tips_product_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_product` ADD CONSTRAINT `tips_product_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_product` ADD CONSTRAINT `tips_product_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_product` ADD CONSTRAINT `tips_product_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_service` ADD CONSTRAINT `tips_service_sale_item_id_transaction_services_id_fk` FOREIGN KEY (`sale_item_id`) REFERENCES `transaction_services`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_service` ADD CONSTRAINT `tips_service_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_service` ADD CONSTRAINT `tips_service_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_service` ADD CONSTRAINT `tips_service_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_service` ADD CONSTRAINT `tips_service_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips_service` ADD CONSTRAINT `tips_service_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;