-- CreateEnum
CREATE TYPE "IdentityProvider" AS ENUM ('credentials', 'discord', 'google', 'twitter');

-- CreateEnum
CREATE TYPE "CoachCategory" AS ENUM ('general', 'is_featured', 'is_coming_out');

-- CreateEnum
CREATE TYPE "VideoGameCategory" AS ENUM ('general', 'is_featured');

-- CreateEnum
CREATE TYPE "VideoSource" AS ENUM ('vimeo', 'youtube');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('stripe', 'paypal', 'mercado_pago');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'es', 'pt');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('one_time', 'subscription', 'donation');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('usd');

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" STRING,
    "description" STRING,
    "source" "VideoSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoGame" (
    "id" UUID NOT NULL,
    "codename" STRING NOT NULL,
    "category" "VideoGameCategory" NOT NULL DEFAULT E'general',
    "isActive" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "id" UUID NOT NULL,
    "email" STRING NOT NULL,
    "username" STRING NOT NULL,
    "discord" JSONB,
    "discordJoinDate" TIMESTAMP(3),
    "languages" "Language"[],
    "locale" "Language",
    "timeZone" STRING,
    "category" "CoachCategory" NOT NULL DEFAULT E'general',
    "isActive" BOOL NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" STRING NOT NULL,
    "username" STRING,
    "displayName" STRING,
    "password" STRING,
    "discord" JSONB,
    "discordJoinDate" TIMESTAMP(3),
    "locale" "Language",
    "timeZone" STRING,
    "stripe" JSONB,
    "isActive" BOOL NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "type" "PaymentType" NOT NULL,
    "stripe" JSONB,
    "coachId" STRING,
    "tierId" STRING,
    "validFrom" TIMESTAMP(3),
    "validTill" TIMESTAMP(3),
    "billingInterval" "Frequency",
    "billingAmount" FLOAT8 NOT NULL,
    "billingCurrency" "Currency" NOT NULL,
    "isCancelled" BOOL,
    "cancellationReason" STRING,
    "livemode" BOOL NOT NULL DEFAULT true,
    "isActive" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" UUID NOT NULL,
    "coachId" UUID NOT NULL,
    "codename" STRING NOT NULL,
    "type" "PaymentType" NOT NULL,
    "price" FLOAT8 NOT NULL,
    "currency" "Currency" NOT NULL,
    "billingInterval" "Frequency",
    "language" "Language" NOT NULL,
    "discordRoleIds" STRING[],
    "isActive" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" FLOAT8 NOT NULL,
    "currency" "Currency" NOT NULL,
    "stripe" JSONB,
    "livemode" BOOL NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "primary" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoachToVideoGame" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Coach_email_key" ON "Coach"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_username_key" ON "Coach"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_CoachToVideoGame_AB_unique" ON "_CoachToVideoGame"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachToVideoGame_B_index" ON "_CoachToVideoGame"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "fk_studentId_ref_Student" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tier" ADD CONSTRAINT "fk_coachId_ref_Coach" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "fk_orderId_ref_Order" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachToVideoGame" ADD CONSTRAINT "_CoachToVideoGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachToVideoGame" ADD CONSTRAINT "_CoachToVideoGame_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
