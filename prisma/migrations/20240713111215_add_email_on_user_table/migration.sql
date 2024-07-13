-- AlterTable
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `users_email_idx` ON `users`(`email`);
