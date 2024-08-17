/*
  Warnings:

  - Added the required column `payment_method` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `payment_method` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;
