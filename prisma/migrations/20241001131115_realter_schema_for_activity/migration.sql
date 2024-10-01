/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `activities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_activity_id_fkey";

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "transaction_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "activities_transaction_id_key" ON "activities"("transaction_id");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
