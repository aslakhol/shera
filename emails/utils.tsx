import { render } from "@react-email/render";
import { env } from "../src/env";
import { type Attendee, type User, type Event } from "@prisma/client";
import Invite from "./Invite";
import { fullEventId } from "../src/utils/event";
import ConfirmationEmail from "./ConfirmationEmail";

export const getInviteEmail = (
  event: Event & { host: User; attendees: Attendee[] },
  emails: string[],
  inviterName?: string,
) => {
  const inviteUrl = `https://shera.no/events/${fullEventId(event)}`;
  const html = render(<Invite event={event} inviterName={inviterName} />);

  const inviteEmail = {
    to: emails,
    from: env.EMAIL_FROM,
    subject: inviterName
      ? `${inviterName} has invited you to ${event.title}!`
      : `You've been invited to ${event.title}!`,
    text: `You've been invited to ${event.title}! Head over to ${inviteUrl} to see if there is any more information.`,
    html,
  };

  return inviteEmail;
};

export const getConfirmationEmail = (event: Event, email: string) => {
  const eventUrl = `https://shera.no/events/${fullEventId(event)}`;

  const html = render(<ConfirmationEmail event={event} />);

  const confirmEmail = {
    to: email,
    from: env.EMAIL_FROM,
    subject: `You are attending ${event.title}!`,
    text: `You are attending ${event.title}! Head over to ${eventUrl} to confirm your attendance.`,
    html,
  };

  return confirmEmail;
};
