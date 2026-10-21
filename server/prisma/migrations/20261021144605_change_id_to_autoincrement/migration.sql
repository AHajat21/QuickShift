/*
  Warnings:

  - The primary key for the `shifts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `shifts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `time_offs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `time_offs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `availabilities` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `day` on the `shifts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_employeeId_fkey";

-- AlterTable
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek" NOT NULL,
ADD CONSTRAINT "shifts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "time_offs" DROP CONSTRAINT "time_offs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "time_offs_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "availabilities";

-- CreateTable
CREATE TABLE "unavailabilities" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unavailabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "unavailabilities_employeeId_idx" ON "unavailabilities"("employeeId");

-- AddForeignKey
ALTER TABLE "unavailabilities" ADD CONSTRAINT "unavailabilities_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
