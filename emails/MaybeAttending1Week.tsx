import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type MaybeAttending1Week = {
  event: Event & { host: User; attendees: Attendee[] };
};

export const MaybeAttending1Week = ({ event }: MaybeAttending1Week) => {
  const attendPrompt = `${event.title} is happening in 1 week and your attendance is set to maybe, let ${event.host.name ? event.host.name : "the host"} know if you are coming!`;

  return (
    <EventEmail
      event={event}
      previewText={`Are you attending ${event.title}?`}
      aboveText="Are you attending"
      bodyText={attendPrompt}
    />
  );
};

export default MaybeAttending1Week;

MaybeAttending1Week.PreviewProps = {
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
        status: "MAYBE",
        userId: "userId",
      },
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
} satisfies MaybeAttending1Week;
