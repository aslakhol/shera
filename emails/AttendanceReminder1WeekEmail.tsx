import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { formatHostNamesShort } from "./utils";
import { previewEvent, previewUser } from "./previews";

type AttendanceReminder1WeekEmailProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
  attendanceStatus: "INVITED" | "MAYBE";
};

export const AttendanceReminder1WeekEmail = ({
  event,
  attendanceStatus,
}: AttendanceReminder1WeekEmailProps) => {
  const attendPrompt =
    attendanceStatus === "INVITED"
      ? `You are invited to ${event.title} in 1 week, let ${formatHostNamesShort(event.hosts)} know if you are coming!`
      : `${event.title} is happening in 1 week and your attendance is set to maybe, let ${formatHostNamesShort(event.hosts)} know if you are coming!`;

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
    ...previewEvent,
    hosts: [previewUser, previewUser, previewUser, previewUser],
  },
  attendanceStatus: "INVITED",
} satisfies AttendanceReminder1WeekEmailProps;
