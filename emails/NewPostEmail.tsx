import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent, previewUser } from "./previews";

type NewPostEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
  poster: User;
};

export const NewPostEmail = ({ event, poster }: NewPostEmailProps) => {
  const body = `${poster.name ?? "Someone"} posted in ${event.title}.`;

  return (
    <EventEmail
      event={event}
      previewText={`New post in ${event.title}`}
      aboveText={`New post in`}
      bodyText={body}
    />
  );
};

export default NewPostEmail;

NewPostEmail.PreviewProps = {
  event: previewEvent,
  poster: previewUser,
} satisfies NewPostEmailProps;
