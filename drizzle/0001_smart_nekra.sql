CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sender` enum('me','you') NOT NULL,
	`text` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
