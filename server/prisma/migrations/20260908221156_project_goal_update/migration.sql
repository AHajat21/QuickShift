/*
  Warnings:

  - You are about to drop the column `description` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `joinCode` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `shift_swap_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_off_requests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[companyId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "shift_swap_requests" DROP CONSTRAINT "shift_swap_requests_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "shift_swap_requests" DROP CONSTRAINT "shift_swap_requests_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "shift_swap_requests" DROP CONSTRAINT "shift_swap_requests_targetId_fkey";

-- DropForeignKey
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "time_off_requests" DROP CONSTRAINT "time_off_requests_employeeId_fkey";

-- DropIndex
DROP INDEX "companies_joinCode_key";

-- DropIndex
DROP INDEX "users_companyId_idx";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "description",
DROP COLUMN "joinCode";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- DropTable
DROP TABLE "shift_swap_requests";

-- DropTable
DROP TABLE "time_off_requests";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_offs" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_offs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "time_offs_employeeId_idx" ON "time_offs"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_companyId_key" ON "users"("companyId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_offs" ADD CONSTRAINT "time_offs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
