CREATE INDEX `entries_level_idx` ON `entries` (`level`);--> statement-breakpoint
CREATE INDEX `entry_updates_entry_id_idx` ON `entry_updates` (`entry_id`);--> statement-breakpoint
CREATE INDEX `journal_blocks_entry_id_idx` ON `journal_blocks` (`journal_entry_id`);