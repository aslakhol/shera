import { type Attendee, type Event, type User } from "@prisma/client";

export type UserNetwork = Array<Friend>;

export type Friend = {
  userId: string;
  name: string;
  events: Array<{
    publicId: string;
    title: string;
  }>;
};

export type EventRowProps = {
  event: Event & { hosts: User[]; attendees: Attendee[] };
};

export type EventWithHosts = Event & { hosts: User[] };
