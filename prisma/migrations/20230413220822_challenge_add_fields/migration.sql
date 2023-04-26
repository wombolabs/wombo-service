/*
  Warnings:

  - You are about to drop the column `prizeWon` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `profit` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "prizeWon";
ALTER TABLE "Challenge" DROP COLUMN "profit";
ALTER TABLE "Challenge" ADD COLUMN     "fee" FLOAT8;
ALTER TABLE "Challenge" ADD COLUMN     "ranking" STRING;
ALTER TABLE "Challenge" ADD COLUMN     "server" STRING;
