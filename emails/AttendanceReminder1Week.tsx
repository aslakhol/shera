import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type AttendanceReminder1Week = {
  event: Event & { host: User; attendees: Attendee[] };
  attendanceStatus: "INVITED" | "MAYBE";
};

export const AttendanceReminder1Week = ({
  event,
  attendanceStatus,
}: AttendanceReminder1Week) => {
  const attendPrompt = attendanceStatus
    ? `You are invited to ${event.title} in 1 week, let ${event.host.name ? event.host.name : "the host"} know if you are coming!`
    : `${event.title} is happening in 1 week and your attendance is set to maybe, let ${event.host.name ? event.host.name : "the host"} know if you are coming!`;

  return (
    <EventEmail
      event={event}
      previewText={`Are you attending ${event.title}?`}
      aboveText="Are you attending"
      bodyText={attendPrompt}
    />
  );
};

export default AttendanceReminder1Week;

AttendanceReminder1Week.PreviewProps = {
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
} satisfies AttendanceReminder1Week;
