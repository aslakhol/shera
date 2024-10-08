import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent, previewUser } from "./previews";

type NewPostProps = {
  event: Event & { host: User; attendees: Attendee[] };
  poster: User;
};

export const NewPost = ({ event, poster }: NewPostProps) => {
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

export default NewPost;

NewPost.PreviewProps = {
  event: previewEvent,
  poster: previewUser,
} satisfies NewPostProps;
