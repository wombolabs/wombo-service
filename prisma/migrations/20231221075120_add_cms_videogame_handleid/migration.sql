/*
  Warnings:

  - You are about to drop the column `ranking` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `videoGameId` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `videoGame` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentsFirstPlace` on the `Stat` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentsSecondPlace` on the `Stat` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentsThirdPlace` on the `Stat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "ranking";
ALTER TABLE "Challenge" DROP COLUMN "videoGameId";
ALTER TABLE "Challenge" ADD COLUMN     "cmsVideoGameHandleId" UUID;

-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "videoGame";
ALTER TABLE "Competition" ADD COLUMN     "cmsVideoGameHandleId" UUID;
ALTER TABLE "Competition" ADD COLUMN     "videoGameId" UUID;

-- AlterTable
ALTER TABLE "Stat" DROP COLUMN "tournamentsFirstPlace";
ALTER TABLE "Stat" DROP COLUMN "tournamentsSecondPlace";
ALTER TABLE "Stat" DROP COLUMN "tournamentsThirdPlace";
ALTER TABLE "Stat" ADD COLUMN     "cmsVideoGameHandleId" UUID;
