/*
  Warnings:

  - You are about to drop the column `yearGroup` on the `MissionRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MissionRegistration" DROP COLUMN "yearGroup",
ADD COLUMN     "yearOfStudy" INTEGER;
