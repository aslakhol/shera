import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent } from "./previews";
import { Text } from "@react-email/components";

type UpdatedEventEmailProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
  changes: string[];
};

export const UpdatedEventEmail = ({
  event,
  changes,
}: UpdatedEventEmailProps) => {
  return (
    <EventEmail
      event={event}
      previewText={`New post in ${event.title}`}
      belowText={`Has been updated`}
      body={<UpdatedBody changes={changes} />}
    />
  );
};

export default UpdatedEventEmail;

UpdatedEventEmail.PreviewProps = {
  event: previewEvent,
  changes: [
    `The location changed from "Brød & Sirkus" to "Fyrhuset Kuba".`,
    `The event description was updated`,
    `The time was changed from 18:00 to 20:00`,
    `The date was changed from October 31st to October 29th`,
  ],
} satisfies UpdatedEventEmailProps;

type UpdatedBodyProps = { changes: string[] };

const UpdatedBody = ({ changes }: UpdatedBodyProps) => {
  return (
    <>
      <Text>The following information has been updated:</Text>
      <ul className="text-sm ">
        {changes.map((change) => (
          <li key={change}>{change}</li>
        ))}
      </ul>
    </>
  );
};
