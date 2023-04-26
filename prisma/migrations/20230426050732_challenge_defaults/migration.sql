/*
  Warnings:

  - Made the column `betAmount` on table `Challenge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fee` on table `Challenge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "betAmount" SET NOT NULL;
ALTER TABLE "Challenge" ALTER COLUMN "betAmount" SET DEFAULT 0;
ALTER TABLE "Challenge" ALTER COLUMN "fee" SET NOT NULL;
ALTER TABLE "Challenge" ALTER COLUMN "fee" SET DEFAULT 0;
