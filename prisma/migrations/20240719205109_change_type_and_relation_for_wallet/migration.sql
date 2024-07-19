/*
  Warnings:

  - You are about to drop the `walet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `walet` DROP FOREIGN KEY `walet_userid_fkey`;

-- DropTable
DROP TABLE `walet`;

-- CreateTable
CREATE TABLE `wallet` (
    `id` VARCHAR(191) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL,

    UNIQUE INDEX `wallet_userid_key`(`userid`),
    INDEX `wallet_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `wallet` ADD CONSTRAINT `wallet_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
