import { type Attendee, type User, type Event } from "@prisma/client";

export const previewEvent: Event & { hosts: User[]; attendees: Attendee[] } = {
  eventId: 42,
  publicId: "publicId",
  description: "Vi spiser noe pils og drikker en pizza",
  title: "4 Pils og en Pizza",
  place: "Jens Bjelkes gate 72",
  dateTime: new Date(),
  timeZone: "Europe/Oslo",
  createdAt: new Date(),
  updatedAt: new Date(),
  hosts: [
    {
      id: "hostId",
      name: "Aslak Hollund",
      email: "aslak@shera.no",
      emailVerified: new Date(),
      image: null,
    },
    {
      id: "hostId2",
      name: "Jane Doe",
      email: "jane@example.com",
      emailVerified: new Date(),
      image: null,
    },
    {
      id: "hostId3",
      name: "John Doe",
      email: "john@example.com",
      emailVerified: new Date(),
      image: null,
    },
  ],
  attendees: [
    {
      attendeeId: "attendeeId",
      name: "Aslak Hollund",
      email: "aslak@shera.no",
      eventId: 42,
      status: "GOING",
      userId: "userId",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      attendeeId: "attendeeId2",
      name: "Jane Doe",
      email: "jane@example.com",
      eventId: 42,
      status: "GOING",
      userId: "userId2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export const previewUser: User = {
  id: "posterId",
  name: "John Doe",
  email: "john@example.com",
  emailVerified: new Date(),
  image: null,
};
