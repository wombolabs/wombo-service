-- RenameForeignKey
ALTER TABLE "Stat" RENAME CONSTRAINT "Stat_ownerId_fkey" TO "fk_studentId_ref_Student";
