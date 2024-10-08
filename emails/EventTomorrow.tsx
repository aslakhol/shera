import * as React from "react";
import { EventEmail } from "./components/EventEmail";
import { type Attendee, type Event, type User } from "@prisma/client";
import { previewEvent } from "./previews";

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
  event: previewEvent,
} satisfies EventTomorrowProps;
