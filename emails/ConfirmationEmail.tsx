import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";
import { previewEvent } from "./previews";

type ConfirmationEmailProps = {
  event: Event & { host: User; attendees: Attendee[] };
  attendanceStatus: "GOING" | "MAYBE";
};

export const ConfirmationEmail = ({
  event,
  attendanceStatus,
}: ConfirmationEmailProps) => {
  const body =
    attendanceStatus === "MAYBE"
      ? `Make sure to let ${event.host.name ? event.host.name : "the host"} know if you are going soon!`
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
  event: previewEvent,
} satisfies ConfirmationEmailProps;
