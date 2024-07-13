-- AlterTable
ALTER TABLE `users` ADD COLUMN `last_login_ip` VARCHAR(191) NULL,
    ADD COLUMN `last_login_timestamp` VARCHAR(191) NULL,
    ADD COLUMN `last_login_user_agent` VARCHAR(191) NULL;
