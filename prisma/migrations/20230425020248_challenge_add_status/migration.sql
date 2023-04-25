-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('published', 'in_progress', 'finished', 'cancelled', 'reviewing');

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "status" "ChallengeStatus" NOT NULL DEFAULT 'published';
