-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Platform_Admin', 'Owner', 'Manager', 'Trainer', 'Member');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('MAIN', 'FRANCHISE');

-- CreateEnum
CREATE TYPE "TrainerType" AS ENUM ('PERSONAL', 'GROUP', 'YOGA', 'CARDIO', 'STRENGTH');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'FROZEN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateEnum
CREATE TYPE "AttendanceSource" AS ENUM ('MANUAL', 'QR_CODE', 'BIOMETRIC', 'MOBILE_APP');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'CHEQUE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20),
    "role" "Role" NOT NULL DEFAULT 'Member',
    "account_status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email_verified" BOOLEAN DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "gym_name" TEXT NOT NULL,
    "business_email" VARCHAR(255) NOT NULL,
    "gym_legal_address" VARCHAR(200) NOT NULL,
    "business_phone" VARCHAR(20),
    "logo_url" TEXT,
    "website" TEXT,
    "gst_number" VARCHAR(50),
    "register_number" VARCHAR(50),
    "timezone" VARCHAR(20),
    "currency" VARCHAR(20),
    "address" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(50),
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "plan_name" VARCHAR(255) NOT NULL,
    "trial_days" INTEGER DEFAULT 7,
    "description" VARCHAR(255) NOT NULL,
    "monthly_price" DECIMAL(9,2) NOT NULL,
    "yearly_price" DECIMAL(9,2),
    "max_branches" INTEGER NOT NULL,
    "max_managers" INTEGER NOT NULL,
    "max_trainers" INTEGER NOT NULL,
    "max_members" INTEGER NOT NULL,
    "storage_limit" INTEGER NOT NULL,
    "billing_cycle" INTEGER NOT NULL,
    "allow_multiple_branches" BOOLEAN NOT NULL DEFAULT false,
    "allow_custom_branding" BOOLEAN NOT NULL DEFAULT false,
    "allow_api_access" BOOLEAN NOT NULL DEFAULT false,
    "allow_reports" BOOLEAN NOT NULL DEFAULT false,
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
    "billing_cycle" "BillingCycle" NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "cancelled_at" TIMESTAMP(3),
    "payment_reference" TEXT,
    "auto_renew" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "branch_code" VARCHAR(20) NOT NULL,
    "branch_name" VARCHAR(56) NOT NULL,
    "business_email" VARCHAR(120) NOT NULL,
    "business_phone" VARCHAR(15) NOT NULL,
    "branch_type" "BranchType" NOT NULL DEFAULT 'MAIN',
    "address" VARCHAR(256) NOT NULL,
    "city" VARCHAR(64) NOT NULL,
    "state" VARCHAR(32) NOT NULL,
    "country" VARCHAR(32) NOT NULL,
    "postal_code" VARCHAR(12) NOT NULL,
    "opening_time" VARCHAR(40) NOT NULL,
    "closing_time" VARCHAR(40) NOT NULL,
    "capacity" INTEGER,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "gymId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerProfile" (
    "id" TEXT NOT NULL,
    "employee_code" VARCHAR(56) NOT NULL,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "salary" DECIMAL(8,2),
    "emergency_contact" VARCHAR(20),
    "reporting_to" VARCHAR(20),
    "emergency_phone" VARCHAR(20),
    "notes" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerProfile" (
    "id" TEXT NOT NULL,
    "employee_code" VARCHAR(56) NOT NULL,
    "specialization" VARCHAR(150),
    "experience_years" INTEGER,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "salary" DECIMAL(8,2),
    "emergency_contact" VARCHAR(20),
    "emergency_phone" VARCHAR(20),
    "trainer_type" "TrainerType" NOT NULL,
    "certification_number" VARCHAR(40),
    "notes" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerBranch" (
    "trainerId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "TrainerBranch_pkey" PRIMARY KEY ("trainerId","branchId")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "member_code" TEXT NOT NULL,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "blood_group" "BloodGroup",
    "emergency_contact" VARCHAR(20),
    "emergency_phone" VARCHAR(20),
    "height" DECIMAL(3,2),
    "weight" DECIMAL(4,2),
    "medical_notes" VARCHAR(250),
    "fitness_goal" VARCHAR(120),
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberTrainer" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "assigned_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberTrainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "description" TEXT,
    "duration_days" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "admission_fee" DECIMAL(65,30),
    "tax_percentage" DECIMAL(65,30),
    "freeze_days_allowed" INTEGER NOT NULL DEFAULT 0,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "deleted_at" TIMESTAMP(3),
    "gymId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberMembership" (
    "id" TEXT NOT NULL,
    "renewed_from_id" TEXT,
    "freeze_start" TIMESTAMP(3),
    "freeze_end" TIMESTAMP(3),
    "notes" TEXT,
    "memberId" TEXT NOT NULL,
    "membership_plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "original_price" DECIMAL(65,30) NOT NULL,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "final_price" DECIMAL(65,30) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "membership_status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "recorded_by" TEXT,
    "attendance_date" TIMESTAMP(3) NOT NULL,
    "check_in" TIMESTAMP(3) NOT NULL,
    "check_out" TIMESTAMP(3),
    "attendance_source" "AttendanceSource" NOT NULL,
    "attendance_status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT,
    "receipt_number" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "member_membership_id" TEXT NOT NULL,
    "collected_by" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "transaction_reference" TEXT,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_business_email_key" ON "Gym"("business_email");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_gym_legal_address_key" ON "Gym"("gym_legal_address");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_plan_name_key" ON "SubscriptionPlan"("plan_name");

-- CreateIndex
CREATE INDEX "Branch_gymId_idx" ON "Branch"("gymId");

-- CreateIndex
CREATE INDEX "Branch_status_idx" ON "Branch"("status");

-- CreateIndex
CREATE INDEX "Branch_deleted_at_idx" ON "Branch"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_gymId_branch_code_key" ON "Branch"("gymId", "branch_code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_gymId_business_email_key" ON "Branch"("gymId", "business_email");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_gymId_business_phone_key" ON "Branch"("gymId", "business_phone");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerProfile_userId_key" ON "ManagerProfile"("userId");

-- CreateIndex
CREATE INDEX "ManagerProfile_branchId_idx" ON "ManagerProfile"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerProfile_branchId_employee_code_key" ON "ManagerProfile"("branchId", "employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerProfile_userId_key" ON "TrainerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE INDEX "Member_branchId_idx" ON "Member"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_branchId_member_code_key" ON "Member"("branchId", "member_code");

-- CreateIndex
CREATE INDEX "MemberTrainer_memberId_idx" ON "MemberTrainer"("memberId");

-- CreateIndex
CREATE INDEX "MemberTrainer_trainerId_idx" ON "MemberTrainer"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberTrainer_memberId_trainerId_key" ON "MemberTrainer"("memberId", "trainerId");

-- CreateIndex
CREATE INDEX "MembershipPlan_gymId_idx" ON "MembershipPlan"("gymId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipPlan_gymId_plan_name_key" ON "MembershipPlan"("gymId", "plan_name");

-- CreateIndex
CREATE INDEX "MemberMembership_memberId_idx" ON "MemberMembership"("memberId");

-- CreateIndex
CREATE INDEX "MemberMembership_membership_status_idx" ON "MemberMembership"("membership_status");

-- CreateIndex
CREATE INDEX "Attendance_memberId_idx" ON "Attendance"("memberId");

-- CreateIndex
CREATE INDEX "Attendance_branchId_idx" ON "Attendance"("branchId");

-- CreateIndex
CREATE INDEX "Attendance_attendance_date_idx" ON "Attendance"("attendance_date");

-- CreateIndex
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");

-- CreateIndex
CREATE INDEX "Payment_member_membership_id_idx" ON "Payment"("member_membership_id");

-- CreateIndex
CREATE INDEX "Payment_payment_date_idx" ON "Payment"("payment_date");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_receipt_number_key" ON "Payment"("receipt_number");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymSubscription" ADD CONSTRAINT "GymSubscription_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymSubscription" ADD CONSTRAINT "GymSubscription_subscription_plan_id_fkey" FOREIGN KEY ("subscription_plan_id") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerProfile" ADD CONSTRAINT "ManagerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerProfile" ADD CONSTRAINT "ManagerProfile_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerProfile" ADD CONSTRAINT "TrainerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerBranch" ADD CONSTRAINT "TrainerBranch_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerBranch" ADD CONSTRAINT "TrainerBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTrainer" ADD CONSTRAINT "MemberTrainer_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTrainer" ADD CONSTRAINT "MemberTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPlan" ADD CONSTRAINT "MembershipPlan_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMembership" ADD CONSTRAINT "MemberMembership_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberMembership" ADD CONSTRAINT "MemberMembership_membership_plan_id_fkey" FOREIGN KEY ("membership_plan_id") REFERENCES "MembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_member_membership_id_fkey" FOREIGN KEY ("member_membership_id") REFERENCES "MemberMembership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_collected_by_fkey" FOREIGN KEY ("collected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
