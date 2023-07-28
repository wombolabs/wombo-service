-- CreateTable
CREATE TABLE "Rating" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rating" INT4 NOT NULL DEFAULT 1000,
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
CREATE UNIQUE INDEX "Rating_ownerId_key" ON "Rating"("ownerId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
