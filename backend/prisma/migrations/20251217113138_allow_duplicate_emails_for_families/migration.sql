/*
  Warnings:

  - A unique constraint covering the columns `[missionId,email,firstName,lastName]` on the table `MissionRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."MissionRegistration_missionId_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "MissionRegistration_missionId_email_firstName_lastName_key" ON "MissionRegistration"("missionId", "email", "firstName", "lastName");
