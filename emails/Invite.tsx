import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type InviteProps = {
  event: Event & { host: User; attendees: Attendee[] };
  inviterName?: string;
};

export const Invite = ({ event, inviterName }: InviteProps) => {
  const preview = inviterName
    ? `${inviterName} has invited you to ${event.title}!`
    : `You've been invited to ${event.title}!`;

  const aboveText = inviterName
    ? `${inviterName} has invited you to`
    : `You've been invited to`;

  return (
    <EventEmail event={event} previewText={preview} aboveText={aboveText} />
  );
};

export default Invite;

Invite.PreviewProps = {
  event: {
    eventId: 42,
    publicId: "publicId",
    description: "Vi spiser noe pils og drikker en pizza",
    title: "4 Pils og en Pizza",
    place: "Jens Bjelkes gate 72",
    hostId: "hostId",
    dateTime: new Date(),
    timeZone: "Europe/Oslo",
    createdAt: new Date(),
    updatedAt: new Date(),
    host: {
      id: "hostId",
      name: "Aslak Hollund",
      email: "aslak@shera.no",
      emailVerified: new Date(),
      image: null,
    },
    attendees: [
      {
        attendeeId: "attendeeId",
        name: "Aslak Hollund",
        email: "aslak@shera.no",
        eventId: 42,
        status: "GOING",
        userId: "userId",
      },
    ],
  },
  inviterName: "Aslak",
} as InviteProps;
