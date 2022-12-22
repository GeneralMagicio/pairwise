/*
  Warnings:

  - You are about to drop the column `maxPairsPerUser` on the `BudgetBox` table. All the data in the column will be lost.
  - You are about to alter the column `maxVotesPerUser` on the `BudgetBox` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "BudgetBox" DROP COLUMN "maxPairsPerUser",
ADD COLUMN     "maxPairsPerVote" INTEGER NOT NULL DEFAULT 20,
ALTER COLUMN "maxVotesPerUser" SET DEFAULT 1,
ALTER COLUMN "maxVotesPerUser" SET DATA TYPE INTEGER;
