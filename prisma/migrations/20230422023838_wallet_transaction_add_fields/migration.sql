/*
  Warnings:

  - Added the required column `type` to the `WalletTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('t_deposit_', 't_withdrawal_', 't_purchase_', 't_refund_', 't_fee_');

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "type" "WalletTransactionType" NOT NULL;
