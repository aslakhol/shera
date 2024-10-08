import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent, previewUser } from "./previews";

type NewPostProps = {
  event: Event & { host: User; attendees: Attendee[] };
  poster: User;
};

export const NewPost = ({ event, poster }: NewPostProps) => {
  const body = `${poster.name ?? "Someone"} posted on ${event.title}.`;

  return (
    <EventEmail
      event={event}
      previewText={`New post on ${event.title}`}
      aboveText={`New post on`}
      bodyText={body}
    />
  );
};

export default NewPost;

NewPost.PreviewProps = {
  event: previewEvent,
  poster: previewUser,
} satisfies NewPostProps;
