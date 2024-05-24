import { render } from "@react-email/render";
import { env } from "../src/env";
import { type Event } from "@prisma/client";
import Invite from "./Invite";
import { fullEventId } from "../src/utils/event";

export const getInviteEmail = (
  event: Event,
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
