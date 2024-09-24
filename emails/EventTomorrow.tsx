import * as React from "react";
import { EventEmail } from "./components/EventEmail";
import { type Attendee, type Event, type User } from "@prisma/client";

type EventTomorrowProps = {
  event: Event & { host: User; attendees: Attendee[] };
};

export const EventTomorrow = ({ event }: EventTomorrowProps) => {
  return (
    <EventEmail
      event={event}
      previewText={`${event.title} starting tomorrow`}
      belowText="Is starting tomorrow"
    />
  );
};

export default EventTomorrow;

EventTomorrow.PreviewProps = {
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
} as EventTomorrowProps;
