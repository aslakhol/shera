import * as React from "react";
import { type Event, type User, type Attendee } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent } from "./previews";
import { Button, Text } from "@react-email/components";

type HostInviteEmailProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
  inviterName?: string;
  acceptInviteLink: string;
};

export const HostInviteEmail = ({
  event,
  inviterName,
  acceptInviteLink,
}: HostInviteEmailProps) => {
  const preview = inviterName
    ? `${inviterName} has invited you to co-host ${event.title}!`
    : `You've been invited to co-host ${event.title}!`;

  const aboveText = inviterName
    ? `${inviterName} has invited you to co-host:`
    : `You've been invited to co-host:`;

  return (
    <EventEmail
      event={event}
      previewText={preview}
      aboveText={aboveText}
      body={
        <div>
          <Text className="text-sm">
            Click the button below to accept the invitation:
          </Text>
          <Button
            href={acceptInviteLink}
            className="my-2 whitespace-nowrap rounded-md bg-[#1f1d63] px-12 py-2 text-sm font-medium text-[#fff] ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Accept Co-Host Invitation
          </Button>
        </div>
      }
    />
  );
};

export default HostInviteEmail;

// Example preview props with required fields
HostInviteEmail.PreviewProps = {
  event: previewEvent,
  inviterName: "Aslak",
  acceptInviteLink: "http://localhost:3000/accept-invite/testtoken123",
} satisfies HostInviteEmailProps;
