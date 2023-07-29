/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_ownerId_fkey";

-- DropTable
DROP TABLE "Rating";

-- CreateTable
CREATE TABLE "Stat" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rating" INT4 NOT NULL DEFAULT 1000,
    "highestRating" INT4 NOT NULL DEFAULT 1000,
    "highestRatingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ratingDelta" INT4 NOT NULL DEFAULT 0,
    "accOpponentsRating" INT4 NOT NULL DEFAULT 0,
    "highestRatingOpponent" INT4 NOT NULL DEFAULT 0,
    "matchesWon" INT4 NOT NULL DEFAULT 0,
    "matchesDraw" INT4 NOT NULL DEFAULT 0,
    "matchesLost" INT4 NOT NULL DEFAULT 0,
    "matchesGoalsFor" INT4 NOT NULL DEFAULT 0,
    "matchesGoalsAgainst" INT4 NOT NULL DEFAULT 0,
    "tournamentsFirstPlace" INT4 NOT NULL DEFAULT 0,
    "tournamentsSecondPlace" INT4 NOT NULL DEFAULT 0,
    "tournamentsThirdPlace" INT4 NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stat_ownerId_key" ON "Stat"("ownerId");

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
