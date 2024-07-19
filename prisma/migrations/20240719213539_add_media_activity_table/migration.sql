/*
  Warnings:

  - Added the required column `type` to the `wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `activity_id` VARCHAR(191) NULL,
    ADD COLUMN `wallet_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `wallet` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `activities` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `id` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `media_type` VARCHAR(191) NOT NULL,
    `activity_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media` ADD CONSTRAINT `media_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
