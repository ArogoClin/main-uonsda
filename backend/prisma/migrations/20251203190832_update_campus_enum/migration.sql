/*
  Warnings:

  - The values [KNH] on the enum `Campus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Campus_new" AS ENUM ('KENYA_SCIENCE', 'MEDICAL_SCHOOL', 'MAIN', 'CHIROMO', 'LOWER_KABETE', 'PARKLANDS', 'UPPER_KABETE', 'PUEA', 'ASSOCIATE', 'KIKUYU', 'VISITOR');
ALTER TABLE "MissionRegistration" ALTER COLUMN "campus" TYPE "Campus_new" USING ("campus"::text::"Campus_new");
ALTER TYPE "Campus" RENAME TO "Campus_old";
ALTER TYPE "Campus_new" RENAME TO "Campus";
DROP TYPE "public"."Campus_old";
COMMIT;
