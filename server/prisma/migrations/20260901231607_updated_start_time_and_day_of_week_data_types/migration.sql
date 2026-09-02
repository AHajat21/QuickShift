/*
  Warnings:

  - You are about to drop the column `email` on the `companies` table. All the data in the column will be lost.
  - The `status` column on the `shift_swap_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `time_off_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[joinCode]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `dayOfWeek` on the `availabilities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `joinCode` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'NULL';

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_companyId_fkey";

-- DropIndex
DROP INDEX "companies_email_key";

-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "email",
ADD COLUMN     "joinCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shift_swap_requests" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "shifts" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "time_off_requests" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ShiftSwapStatus";

-- DropEnum
DROP TYPE "TimeOffStatus";

-- CreateIndex
CREATE UNIQUE INDEX "companies_joinCode_key" ON "companies"("joinCode");

-- CreateIndex
CREATE INDEX "shift_swap_requests_status_idx" ON "shift_swap_requests"("status");

-- CreateIndex
CREATE INDEX "time_off_requests_status_idx" ON "time_off_requests"("status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
