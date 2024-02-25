/*
  Warnings:

 Manually edited

*/
-- DropForeignKey
ALTER TABLE "Attendees" DROP CONSTRAINT "Attendees_eventId_fkey";

ALTER TABLE "Attendees" RENAME TO "Attendee";

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_name_eventId_key" ON "Attendee"("name", "eventId");

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
