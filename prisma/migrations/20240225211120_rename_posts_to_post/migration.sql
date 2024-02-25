/*
  Warnings:

  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_eventsId_fkey";

-- DropTable
ALTER TABLE "Posts" RENAME TO "Post";

ALTER TABLE "Post" RENAME CONSTRAINT "Posts_pkey" TO "Post_pkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_eventsId_fkey" FOREIGN KEY ("eventsId") REFERENCES "Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
