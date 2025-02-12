import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent, previewUser } from "./previews";

type NewPostEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
  poster: User;
  message: string;
};

export const NewPostEmail = ({ event, poster, message }: NewPostEmailProps) => {
  const body = `
  ${poster.name ?? "Someone"} posted in ${event.title}:

  ${message}
  `;

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
  message:
    "Jeg vet jeg skrev at vi skulle knekke den første pilsen klokka 4, men det er visst alt knukket, whoops. Så da er dørene åpne, kom når det passer dere! Pizza er bestilt til 17 og som nevnt så er det førstemann til mølla ^^",
} satisfies NewPostEmailProps;
