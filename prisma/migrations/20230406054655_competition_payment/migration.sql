-- AlterEnum
ALTER TYPE "PaymentType"ADD VALUE 'competition';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "competitionId" STRING;
