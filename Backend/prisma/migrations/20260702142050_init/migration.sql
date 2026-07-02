-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Platform_Admin', 'Owner', 'Manager', 'Trainer', 'User');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BLOCKING', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESSFUL', 'FAILED', 'PENDING', 'DUE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',
    "account_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gym_name" TEXT NOT NULL,
    "business_email" VARCHAR(255) NOT NULL,
    "business_phone" VARCHAR(20) NOT NULL,
    "logo_url" TEXT,
    "website" TEXT,
    "gst_number" VARCHAR(50),
    "register_number" VARCHAR(50),
    "address" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "plan_name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" DECIMAL(9,2) NOT NULL,
    "max_branches" INTEGER,
    "max_managers" INTEGER,
    "max_trainers" INTEGER,
    "max_members" INTEGER,
    "storage_limit" INTEGER NOT NULL,
    "billing_cycle" INTEGER NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymSubscription" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "subscription_plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'SUCCESSFUL',
    "subscription_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "auto_renew" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_business_email_key" ON "Gym"("business_email");

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymSubscription" ADD CONSTRAINT "GymSubscription_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymSubscription" ADD CONSTRAINT "GymSubscription_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
