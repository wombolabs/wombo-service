-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "competitionId" UUID;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
