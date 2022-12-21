/*
  Warnings:

  - You are about to drop the column `maxpairsPerUser` on the `BudgetBox` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BudgetBox" DROP COLUMN "maxpairsPerUser",
ADD COLUMN     "maxPairsPerUser" DECIMAL(65,30) NOT NULL DEFAULT 20;
