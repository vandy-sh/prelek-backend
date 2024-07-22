/*
  Warnings:

  - Made the column `wallet_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_wallet_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `wallet_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
