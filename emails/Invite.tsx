import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent } from "./previews";

type InviteProps = {
  event: Event & { host: User; attendees: Attendee[] };
  inviterName?: string;
};

export const Invite = ({ event, inviterName }: InviteProps) => {
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

export default Invite;

Invite.PreviewProps = {
  event: previewEvent,
  inviterName: "Aslak",
} satisfies InviteProps;
