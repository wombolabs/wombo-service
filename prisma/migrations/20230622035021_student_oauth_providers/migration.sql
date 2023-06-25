-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "facebook" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Student" ADD COLUMN     "google" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Student" ADD COLUMN     "twitter" JSONB NOT NULL DEFAULT '{}';
