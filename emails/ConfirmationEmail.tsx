import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type ConfirmationEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
};

export const ConfirmationEmail = ({ event }: ConfirmationEmailProps) => {
  return (
    <EventEmail
      event={event}
      previewText={`You are attending ${event.title}`}
      aboveText="You are attending"
    />
  );
};

export default ConfirmationEmail;

ConfirmationEmail.PreviewProps = {
  event: {
    eventId: 42,
    publicId: "publicId",
    description: "Vi spiser noe pils og drikker en pizza",
    title: "4 Pils og en Pizza",
    place: "Jens Bjelkes gate 72",
    hostId: "hostId",
    dateTime: new Date(),
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
} satisfies ConfirmationEmailProps;
