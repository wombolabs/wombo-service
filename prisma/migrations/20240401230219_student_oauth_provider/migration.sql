-- AlterEnum
ALTER TYPE "ChallengeType" ADD VALUE 'anonymous_player_vs_player';
ALTER TYPE "ChallengeType" ADD VALUE 'matchmaking_player_vs_player';

-- DropForeignKey
--ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_ownerId_fkey";

-- AlterTable
--ALTER TABLE "Challenge" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
--ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
