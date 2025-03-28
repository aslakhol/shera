/*
  Warnings:

  - You are about to drop the column `hostId` on the `Event` table. All the data in the column will be lost.

*/
-- First create the new table and indexes
CREATE TABLE "_EventHosts" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX "_EventHosts_AB_unique" ON "_EventHosts"("A", "B");
CREATE INDEX "_EventHosts_B_index" ON "_EventHosts"("B");

-- Add foreign key constraints
ALTER TABLE "_EventHosts" ADD CONSTRAINT "_EventHosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_EventHosts" ADD CONSTRAINT "_EventHosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Copy existing host relationships to the new table
INSERT INTO "_EventHosts" ("A", "B")
SELECT "eventId", "hostId" FROM "Event";

-- Now we can safely drop the old column
ALTER TABLE "Event" DROP CONSTRAINT "Event_hostId_fkey";
ALTER TABLE "Event" DROP COLUMN "hostId";
