import { render } from "@react-email/render";
import { env } from "../src/env";
import { type Attendee, type User, type Event } from "@prisma/client";
import Invite from "./Invite";
import ConfirmationEmail from "./ConfirmationEmail";

export const getInviteEmail = (
  event: Event & { host: User; attendees: Attendee[] },
  emails: string[],
  inviterName?: string,
) => {
  const html = render(<Invite event={event} inviterName={inviterName} />);
  const text = render(<Invite event={event} inviterName={inviterName} />, {
    plainText: true,
  });

  const inviteEmail = {
    to: emails,
    from: env.EMAIL_FROM,
    subject: inviterName
      ? `${inviterName} has invited you to ${event.title}!`
      : `You've been invited to ${event.title}!`,
    text,
    html,
  };

  return inviteEmail;
};

export const getConfirmationEmail = (
  event: Event & { host: User; attendees: Attendee[] },
  email: string,
  status: "GOING" | "MAYBE",
) => {
  const html = render(
    <ConfirmationEmail event={event} attendanceStatus={status} />,
  );
  const text = render(
    <ConfirmationEmail event={event} attendanceStatus={status} />,
    {
      plainText: true,
    },
  );

  const confirmEmail = {
    to: email,
    from: env.EMAIL_FROM,
    subject: `You are ${status === "MAYBE" ? "maybe " : ""}attending ${event.title}!`,
    text,
    html,
  };

  return confirmEmail;
};
