/*
  Warnings:

  - Added the required column `ownerId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "ownerId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
