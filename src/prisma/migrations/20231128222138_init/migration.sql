/*
  Warnings:

  - The primary key for the `TransactionTable` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_tableId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "tableId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TransactionTable" DROP CONSTRAINT "TransactionTable_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TransactionTable_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TransactionTable_id_seq";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "TransactionTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
