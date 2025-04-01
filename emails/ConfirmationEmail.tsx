import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent, previewUser } from "./previews";
import { formatHostNamesShort } from "./utils";

type ConfirmationEmailProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
  attendanceStatus: "GOING" | "MAYBE";
};

export const ConfirmationEmail = ({
  event,
  attendanceStatus,
}: ConfirmationEmailProps) => {
  const body =
    attendanceStatus === "MAYBE"
      ? `Make sure to let ${formatHostNamesShort(event.hosts)} know if you are going soon!`
      : undefined;

  return (
    <EventEmail
      event={event}
      previewText={`You are ${attendanceStatus === "MAYBE" ? "maybe " : ""}attending ${event.title}`}
      aboveText={`You are ${attendanceStatus === "MAYBE" ? "maybe " : ""}attending `}
      bodyText={body}
    />
  );
};

export default ConfirmationEmail;

ConfirmationEmail.PreviewProps = {
  attendanceStatus: "MAYBE",
  event: { ...previewEvent, hosts: [{ ...previewUser, name: null }] },
} satisfies ConfirmationEmailProps;
