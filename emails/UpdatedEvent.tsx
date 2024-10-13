import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent, previewUser } from "./previews";

type UpdatedEventProps = {
  event: Event & { host: User; attendees: Attendee[] };
  changes: string[];
};

export const UpdatedEvent = ({ event, changes }: UpdatedEventProps) => {
  const body = `The following information has been updated:
  ${changes.map((change) => `- ${change}`).join("\n")}
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

export default UpdatedEvent;

UpdatedEvent.PreviewProps = {
  event: previewEvent,
  changes: [
    `The location changed from "Brød & Sirkus" to "Fyrhuset Kuba".`,
    `The event description was updated`,
    `The time was changed from 18:00 to 20:00`,
    `The date was changed from October 31st to October 29th`,
  ],
} satisfies UpdatedEventProps;
