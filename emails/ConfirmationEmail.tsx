import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type ConfirmationEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
  attendanceStatus: "GOING" | "MAYBE";
};

export const ConfirmationEmail = ({
  event,
  attendanceStatus,
}: ConfirmationEmailProps) => {
  const body =
    attendanceStatus === "MAYBE"
      ? `Make sure to let ${event.host.name ? event.host.name : "the host"} know if you are going soon!`
      : undefined;

  return (
    <EventEmail
      event={event}
      previewText={`You are ${attendanceStatus === "MAYBE" ? "maybe " : ""}attending ${event.title}`}
      aboveText={`You are ${attendanceStatus === "MAYBE" ? "maybe " : ""}attending `}
      bodyText={body}
    />
  );
};

export default ConfirmationEmail;

ConfirmationEmail.PreviewProps = {
  attendanceStatus: "MAYBE",
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
} satisfies ConfirmationEmailProps;
