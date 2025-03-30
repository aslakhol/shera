import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { formatHostNamesShort } from "./utils";
import { previewEvent, previewUser } from "./previews";

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
  event: { ...previewEvent, hosts: [previewUser] },
  attendanceStatus: "MAYBE",
} satisfies AttendanceReminder3DaysEmailProps;
