-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
