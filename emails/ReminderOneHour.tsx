import * as React from "react";
import { type User, type Event, type Attendee } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

// This is not currently used as I couldn't have crons go more accurate than once an hour on free vercel

type ReminderOneHourProps = {
  event: Event & { host: User; attendees: Attendee[] };
};

export const ReminderOneHour = ({ event }: ReminderOneHourProps) => {
  return (
    <EventEmail
      event={event}
      previewText={`${event.title} is starting in 1 hour`}
      belowText="Is starting in 1 hour"
    />
  );
};

export default ReminderOneHour;

ReminderOneHour.PreviewProps = {
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
} satisfies ReminderOneHourProps;
