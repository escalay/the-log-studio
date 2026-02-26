CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`level` integer NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL,
	`tags` text NOT NULL,
	`content` text NOT NULL,
	`link` text,
	`metrics` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entries_slug_unique` ON `entries` (`slug`);--> statement-breakpoint
CREATE TABLE `entry_updates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entry_id` text NOT NULL,
	`date` text NOT NULL,
	`version` text,
	`type` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `journal_blocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`journal_entry_id` text NOT NULL,
	`sort_order` integer NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`component_name` text,
	FOREIGN KEY (`journal_entry_id`) REFERENCES `journal_entries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text NOT NULL,
	`date` text NOT NULL,
	`quarter` text NOT NULL,
	`read_time` text NOT NULL,
	`cover_image` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journal_entries_slug_unique` ON `journal_entries` (`slug`);