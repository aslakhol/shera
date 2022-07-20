-- CreateTable
CREATE TABLE "Attendees" (
    "attendeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Attendees_pkey" PRIMARY KEY ("attendeeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendees_name_eventId_key" ON "Attendees"("name", "eventId");

-- AddForeignKey
ALTER TABLE "Attendees" ADD CONSTRAINT "Attendees_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
