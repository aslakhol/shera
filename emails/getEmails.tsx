import { render } from "@react-email/render";
import { env } from "../src/env";
import { type Attendee, type User, type Event } from "@prisma/client";
import InviteEmail from "./InviteEmail";
import ConfirmationEmail from "./ConfirmationEmail";
import NewPostEmail from "./NewPostEmail";
import UpdatedEventEmail from "./UpdatedEventEmail";
import HostInviteEmail from "./HostInviteEmail";

type EventWithHostsAndAttendees = Event & {
  hosts: User[];
  attendees: Attendee[];
};

export const getInviteEmail = (
  event: EventWithHostsAndAttendees,
  emails: string[],
  inviterName?: string,
) => {
  const html = render(<InviteEmail event={event} inviterName={inviterName} />);
  const text = render(<InviteEmail event={event} inviterName={inviterName} />, {
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
  event: EventWithHostsAndAttendees,
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

export const getNewPostEmail = (
  message: string,
  event: EventWithHostsAndAttendees,
  emails: string[],
  poster: User,
) => {
  const html = render(
    <NewPostEmail event={event} poster={poster} message={message} />,
  );
  const text = render(
    <NewPostEmail event={event} poster={poster} message={message} />,
    {
      plainText: true,
    },
  );

  const newPostEmail = {
    to: "no-reply@shera.no",
    bcc: emails,
    from: env.EMAIL_FROM,
    subject: `New post in ${event.title}!`,
    text,
    html,
  };

  return newPostEmail;
};

export const getUpdatedEventEmail = (
  event: EventWithHostsAndAttendees,
  changes: string[],
  emails: string[],
) => {
  const html = render(<UpdatedEventEmail event={event} changes={changes} />);
  const text = render(<UpdatedEventEmail event={event} changes={changes} />, {
    plainText: true,
  });

  const updatedEventEmail = {
    to: emails,
    from: env.EMAIL_FROM,
    subject: `${event.title} has been updated!`,
    text,
    html,
  };

  return updatedEventEmail;
};

export const getHostInviteEmail = (
  event: EventWithHostsAndAttendees,
  emails: string[],
  acceptInviteToken: string,
  inviterName?: string,
) => {
  const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}` : "";
  const acceptInviteLink = `${baseUrl}/accept-invite/${acceptInviteToken}`;
  const html = render(
    <HostInviteEmail
      event={event}
      inviterName={inviterName}
      acceptInviteLink={acceptInviteLink}
    />,
  );
  const text = render(
    <HostInviteEmail
      event={event}
      inviterName={inviterName}
      acceptInviteLink={acceptInviteLink}
    />,
    {
      plainText: true,
    },
  );

  const hostInviteEmail = {
    to: "no-reply@shera.no",
    bcc: emails,
    from: env.EMAIL_FROM,
    subject: `${inviterName} has invited you to co-host ${event.title}!`,
    text,
    html,
  };

  return hostInviteEmail;
};
