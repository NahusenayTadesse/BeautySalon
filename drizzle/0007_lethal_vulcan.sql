CREATE TABLE `staff_families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int,
	`relationship` enum('mother','father','spouse','son','daughter','grandchild','grandfather','grandmother','uncle','aunt','brother','sister','other') NOT NULL,
	`gender` enum('male','female') NOT NULL DEFAULT 'male',
	`other_relationship` varchar(255),
	`name` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`email` varchar(255),
	`emergency_contact` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`branch_id` int,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `staff_families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employee_guarantor` MODIFY COLUMN `floor` int;--> statement-breakpoint
ALTER TABLE `staff` ADD `subcity` varchar(100);--> statement-breakpoint
ALTER TABLE `staff` ADD `street` varchar(100);--> statement-breakpoint
ALTER TABLE `staff` ADD `kebele` varchar(100);--> statement-breakpoint
ALTER TABLE `staff` ADD `building_number` varchar(10);--> statement-breakpoint
ALTER TABLE `staff` ADD `floor` int;--> statement-breakpoint
ALTER TABLE `staff` ADD `house_number` varchar(50);--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;