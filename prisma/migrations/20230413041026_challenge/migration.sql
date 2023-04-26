-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('player_vs_player', 'two_vs_two', 'team_vs_team');

-- AlterEnum
ALTER TYPE "PaymentType"ADD VALUE 'challenge';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "challengeId" STRING;

-- CreateTable
CREATE TABLE "Challenge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "videoGame" STRING NOT NULL,
    "type" "ChallengeType" NOT NULL,
    "description" STRING,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "betAmount" FLOAT8,
    "prizeWon" FLOAT8,
    "profit" FLOAT8,
    "ownerId" UUID NOT NULL,
    "challengerId" UUID,
    "isActive" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
