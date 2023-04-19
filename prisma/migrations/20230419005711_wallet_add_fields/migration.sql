-- AlterEnum
ALTER TYPE "PaymentType"ADD VALUE 'wallet';

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
