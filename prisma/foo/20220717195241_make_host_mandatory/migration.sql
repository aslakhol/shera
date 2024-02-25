/*
  Warnings:

  - Made the column `hostId` on table `Events` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_hostId_fkey";

-- AlterTable
ALTER TABLE "Events" ALTER COLUMN "hostId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
