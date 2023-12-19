-- AlterEnum
ALTER TYPE "ChallengeStatus" ADD VALUE 'awaiting_owner_approval';

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "videoGameId" UUID;
