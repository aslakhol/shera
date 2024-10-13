import * as React from "react";
import { EventEmail } from "./components/EventEmail";
import { type Attendee, type Event, type User } from "@prisma/client";
import { previewEvent } from "./previews";

type EventTomorrowEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
};

export const EventTomorrowEmail = ({ event }: EventTomorrowEmailProps) => {
  return (
    <EventEmail
      event={event}
      previewText={`${event.title} starting tomorrow`}
      belowText="Is starting tomorrow"
    />
  );
};

export default EventTomorrowEmail;

EventTomorrowEmail.PreviewProps = {
  event: previewEvent,
} satisfies EventTomorrowEmailProps;
