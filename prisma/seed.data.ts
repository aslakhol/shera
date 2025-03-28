import { nanoId } from "../src/server/db";

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface EventSeed {
  publicId: string;
  title: string;
  description: string;
  dateTime: Date;
  timeZone: string;
  place: string;
  hostId: string;
  attendeeIds: string[];
}

// User IDs as constants
const bellaId = "clh1x8k3g0000mp08pxipqw9k";
const charlieId = "clh1x8k3g0001mp08s1mdpjk2";
const garyId = "clh1x8k3g0002mp08q2n9m5l3";
const pennyId = "clh1x8k3g0003mp08r3o0n6m4";
const mollyId = "clh1x8k3g0004mp08t4p1o7n5";

// Create some sample users
export const users: SeedUser[] = [
  {
    id: bellaId,
    name: "Bella Brie",
    email: "bella@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  },
  {
    id: charlieId,
    name: "Charlie Cheddar",
    email: "charlie@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  },
  {
    id: garyId,
    name: "Gary Gouda",
    email: "gary@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gary",
  },
  {
    id: pennyId,
    name: "Penny Parmesan",
    email: "penny@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Penny",
  },
  {
    id: mollyId,
    name: "Molly Mozzarella",
    email: "molly@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Molly",
  },
];

// Create some sample events
const now = new Date();
export const events: EventSeed[] = [
  {
    publicId: nanoId(),
    title: "Pizza and Board Games Night",
    description:
      "Join us for homemade pizza and strategy games! Cheese provided by the host, naturally.",
    dateTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Charlie's Cheese Palace",
    hostId: charlieId,
    attendeeIds: [charlieId, bellaId, garyId, pennyId],
  },
  {
    publicId: nanoId(),
    title: "Wine and Cheese Tasting",
    description:
      "An evening of fine wines paired with exceptional cheeses. Come expand your palate!",
    dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Bella's Bistro",
    hostId: bellaId,
    attendeeIds: [bellaId, mollyId, pennyId, charlieId],
  },
  {
    publicId: nanoId(),
    title: "Fondue Friday",
    description:
      "Monthly fondue night! Bring your favorite dippers, cheese provided.",
    dateTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Gary's Gourmet Gallery",
    hostId: garyId,
    attendeeIds: [garyId, bellaId, charlieId, mollyId],
  },
  {
    publicId: nanoId(),
    title: "Grilled Cheese Competition",
    description:
      "Who can make the ultimate grilled cheese? Join us to compete or just taste!",
    dateTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Penny's Pantry",
    hostId: pennyId,
    attendeeIds: [pennyId, garyId, mollyId, charlieId],
  },
];
