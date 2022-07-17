-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "hostId" TEXT;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
