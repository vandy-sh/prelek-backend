/*
  Warnings:

  - You are about to drop the column `payment_method` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `payment_method`;