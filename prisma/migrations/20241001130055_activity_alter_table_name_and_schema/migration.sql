/*
  Warnings:

  - You are about to drop the `transaction_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transaction_details" DROP CONSTRAINT "transaction_details_transaction_id_fkey";

-- DropTable
DROP TABLE "transaction_details";

-- CreateTable
CREATE TABLE "activity_details" (
    "id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "activity_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_details_transaction_id_idx" ON "activity_details"("transaction_id");

-- AddForeignKey
ALTER TABLE "activity_details" ADD CONSTRAINT "activity_details_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_details" ADD CONSTRAINT "activity_details_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
