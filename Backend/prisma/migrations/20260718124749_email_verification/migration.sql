-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "emailVerified" BOOLEAN;

-- AlterTable
ALTER TABLE "GymSubscription" ALTER COLUMN "billing_cycle" SET DEFAULT 'MONTHLY';
