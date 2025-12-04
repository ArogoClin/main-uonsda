-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('MAIN', 'KNH', 'PARKLANDS', 'UPPER_KABETE', 'LOWER_KABETE', 'CHIROMO', 'KENYA_SCIENCE', 'PUEA', 'VISITOR');

-- CreateEnum
CREATE TYPE "YearGroup" AS ENUM ('MILLERITES', 'SERAPHS', 'VALOURS', 'REMNANTS', 'PIONEERS', 'AMBASSADORS', 'OTHER');

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "numberOfSites" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionRegistration" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "gender" "Gender" NOT NULL,
    "campus" "Campus" NOT NULL,
    "yearGroup" "YearGroup",
    "isVisitor" BOOLEAN NOT NULL DEFAULT false,
    "homeChurch" TEXT,
    "isFirstTime" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissionDistribution" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "siteNumber" INTEGER NOT NULL,
    "siteName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissionDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mission_name_key" ON "Mission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MissionRegistration_missionId_email_key" ON "MissionRegistration"("missionId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "MissionDistribution_registrationId_key" ON "MissionDistribution"("registrationId");

-- AddForeignKey
ALTER TABLE "MissionRegistration" ADD CONSTRAINT "MissionRegistration_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionDistribution" ADD CONSTRAINT "MissionDistribution_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionDistribution" ADD CONSTRAINT "MissionDistribution_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "MissionRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
