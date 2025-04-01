import * as React from "react";
import { type User, type Event, type Attendee } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent } from "./previews";

// This is not currently used as I couldn't have crons go more accurate than once an hour on free vercel

type ReminderOneHourEmailProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
};

export const ReminderOneHourEmail = ({ event }: ReminderOneHourEmailProps) => {
  return (
    <EventEmail
      event={event}
      previewText={`${event.title} is starting in 1 hour`}
      belowText="Is starting in 1 hour"
    />
  );
};

export default ReminderOneHourEmail;

ReminderOneHourEmail.PreviewProps = {
  event: previewEvent,
} satisfies ReminderOneHourEmailProps;
