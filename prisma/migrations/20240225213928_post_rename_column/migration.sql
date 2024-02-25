/*
  Warnings:

  - You are about to drop the column `eventsId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_eventsId_fkey";

-- AlterTable
ALTER TABLE "Post" RENAME COLUMN "eventsId" TO "eventId";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
