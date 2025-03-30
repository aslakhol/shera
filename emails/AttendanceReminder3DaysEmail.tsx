import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { formatHostNamesShort } from "./utils";

type AttendanceReminder3DaysEmailProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
  attendanceStatus: "INVITED" | "MAYBE";
};

export const AttendanceReminder3DaysEmail = ({
  event,
  attendanceStatus,
}: AttendanceReminder3DaysEmailProps) => {
  const attendPrompt =
    attendanceStatus === "INVITED"
      ? `You are invited to ${event.title} in 3 days, let ${formatHostNamesShort(event.hosts)} know if you are coming!`
      : `${event.title} is happening in 3 days and your attendance is set to maybe, let ${formatHostNamesShort(event.hosts)} know if you are coming!`;

  return (
    <EventEmail
      event={event}
      previewText={`Are you attending ${event.title}?`}
      aboveText="Are you attending"
      bodyText={attendPrompt}
    />
  );
};

export default AttendanceReminder3DaysEmail;

AttendanceReminder3DaysEmail.PreviewProps = {
  event: {
    eventId: 42,
    publicId: "publicId",
    description: "Vi spiser noe pils og drikker en pizza",
    title: "4 Pils og en Pizza",
    place: "Jens Bjelkes gate 72",
    dateTime: new Date(),
    timeZone: "Europe/Oslo",
    createdAt: new Date(),
    updatedAt: new Date(),
    hosts: [
      {
        id: "hostId",
        name: "Aslak Hollund",
        email: "aslak@shera.no",
        emailVerified: new Date(),
        image: null,
      },
    ],
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
  attendanceStatus: "MAYBE",
} satisfies AttendanceReminder3DaysEmailProps;
