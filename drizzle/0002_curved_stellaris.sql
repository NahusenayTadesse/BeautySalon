ALTER TABLE `staff` DROP INDEX `staff_email_unique`;--> statement-breakpoint
ALTER TABLE `staff` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `staff` MODIFY COLUMN `hire_date` timestamp;--> statement-breakpoint
ALTER TABLE `staff` ADD `grand_father_name` varchar(50);