-- AlterTable
ALTER TABLE "Coach" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
