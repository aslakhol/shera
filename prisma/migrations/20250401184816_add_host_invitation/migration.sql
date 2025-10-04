-- CreateTable
CREATE TABLE "HostInvitation" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "invitedUserId" TEXT,
    "invitedUserEmail" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostInvitation_token_key" ON "HostInvitation"("token");

-- CreateIndex
CREATE INDEX "HostInvitation_eventId_idx" ON "HostInvitation"("eventId");

-- CreateIndex
CREATE INDEX "HostInvitation_invitedUserId_idx" ON "HostInvitation"("invitedUserId");

-- CreateIndex
CREATE INDEX "HostInvitation_inviterId_idx" ON "HostInvitation"("inviterId");

-- AddForeignKey
ALTER TABLE "HostInvitation" ADD CONSTRAINT "HostInvitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostInvitation" ADD CONSTRAINT "HostInvitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostInvitation" ADD CONSTRAINT "HostInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
