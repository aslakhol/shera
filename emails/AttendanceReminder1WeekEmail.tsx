import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type AttendanceReminder1WeekEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
  attendanceStatus: "INVITED" | "MAYBE";
};

export const AttendanceReminder1WeekEmail = ({
  event,
  attendanceStatus,
}: AttendanceReminder1WeekEmailProps) => {
  const attendPrompt =
    attendanceStatus === "INVITED"
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

export default AttendanceReminder1WeekEmail;

AttendanceReminder1WeekEmail.PreviewProps = {
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
        status: "MAYBE",
        userId: "userId",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        attendeeId: "attendeeId",
        name: "Aslak Hollund",
        email: "aslak@shera.no",
        eventId: 42,
        status: "GOING",
        userId: "userId",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  attendanceStatus: "INVITED",
} satisfies AttendanceReminder1WeekEmailProps;
