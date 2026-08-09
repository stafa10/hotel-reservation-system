ALTER TABLE `booking` ADD `check_in` text NOT NULL;--> statement-breakpoint
ALTER TABLE `booking` ADD `check_out` text NOT NULL;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `checkIn`;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `checkOut`;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `guests`;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `guest_name`;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `guest_email`;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `guest_phone`;--> statement-breakpoint
ALTER TABLE `booking` DROP COLUMN `status`;