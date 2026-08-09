ALTER TABLE `booking` ADD `guests` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `booking` ADD `guest_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `booking` ADD `guest_email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `booking` ADD `guest_phone` text;--> statement-breakpoint
ALTER TABLE `booking` ADD `status` text DEFAULT 'confirmed' NOT NULL;