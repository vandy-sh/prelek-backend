-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_wallet_id_fkey`;

-- AlterTable
ALTER TABLE `transactions` MODIFY `wallet_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
