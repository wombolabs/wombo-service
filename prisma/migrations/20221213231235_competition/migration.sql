-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('tournament', 'league', 'hub', 'in_house');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('open', 'in_progress', 'finished', 'coming_soon');

-- CreateEnum
CREATE TYPE "CompetitionRegistrationStatus" AS ENUM ('open', 'closed', 'coming_soon');

-- CreateTable
CREATE TABLE "Competition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codename" STRING NOT NULL,
    "type" "CompetitionType" NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "videoGame" UUID,
    "status" "CompetitionStatus" NOT NULL,
    "registrationStatus" "CompetitionRegistrationStatus" NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitionToStudent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Competition_codename_key" ON "Competition"("codename");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToStudent_AB_unique" ON "_CompetitionToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToStudent_B_index" ON "_CompetitionToStudent"("B");

-- AddForeignKey
ALTER TABLE "_CompetitionToStudent" ADD CONSTRAINT "_CompetitionToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitionToStudent" ADD CONSTRAINT "_CompetitionToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
