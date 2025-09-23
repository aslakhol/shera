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

export type EventWithAttendeesAndHosts = Event & {
  hosts: User[];
  attendees: Attendee[];
};

export type EventRowProps = {
  event: EventWithAttendeesAndHosts;
  currentUserId: string;
};

export type EventWithHosts = Event & { hosts: User[] };
