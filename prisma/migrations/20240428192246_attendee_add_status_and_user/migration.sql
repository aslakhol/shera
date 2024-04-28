/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AttendingStatus" AS ENUM ('GOING', 'NOT_GOING', 'MAYBE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Attendee" ADD COLUMN     "status" "AttendingStatus" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_eventId_userId_key" ON "Attendee"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
