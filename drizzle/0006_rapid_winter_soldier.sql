CREATE TABLE `employee_guarantor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`relationship` enum('mother','father','spouse','son','brother','sister','daughter','other') NOT NULL,
	`relation` varchar(255),
	`job_type` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`salary` decimal(10,2) NOT NULL,
	`gurantor_document` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`photo` varchar(255) NOT NULL,
	`govt_id` varchar(255) NOT NULL,
	`email` varchar(255),
	`subcity` varchar(100),
	`street` varchar(100),
	`kebele` varchar(100),
	`building_number` varchar(10),
	`floor` int NOT NULL DEFAULT 0,
	`house_number` varchar(50),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`branch_id` int,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `employee_guarantor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_branch_id_branches_id_fk` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;