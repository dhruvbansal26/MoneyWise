/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `TransactionTable` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TransactionTable_userId_month_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "TransactionTable_userId_key" ON "TransactionTable"("userId");
