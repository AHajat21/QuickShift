/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `availabilities` table. All the data in the column will be lost.
  - Added the required column `day` to the `availabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "dayOfWeek",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;
