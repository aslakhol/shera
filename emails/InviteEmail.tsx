import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent } from "./previews";

type InviteEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
  inviterName?: string;
};

export const InviteEmail = ({ event, inviterName }: InviteEmailProps) => {
  const preview = inviterName
    ? `${inviterName} has invited you to ${event.title}!`
    : `You've been invited to ${event.title}!`;

  const aboveText = inviterName
    ? `${inviterName} has invited you to`
    : `You've been invited to`;

  return (
    <EventEmail event={event} previewText={preview} aboveText={aboveText} />
  );
};

export default InviteEmail;

InviteEmail.PreviewProps = {
  event: previewEvent,
  inviterName: "Aslak",
} satisfies InviteEmailProps;
