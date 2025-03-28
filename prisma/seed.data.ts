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

// Create some sample users
export const users: SeedUser[] = [
  {
    id: "user-bella",
    name: "Bella Brie",
    email: "bella@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  },
  {
    id: "user-charlie",
    name: "Charlie Cheddar",
    email: "charlie@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  },
  {
    id: "user-gary",
    name: "Gary Gouda",
    email: "gary@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gary",
  },
  {
    id: "user-penny",
    name: "Penny Parmesan",
    email: "penny@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Penny",
  },
  {
    id: "user-molly",
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
    hostId: "user-charlie",
    attendeeIds: ["user-bella", "user-gary", "user-penny"],
  },
  {
    publicId: nanoId(),
    title: "Wine and Cheese Tasting",
    description:
      "An evening of fine wines paired with exceptional cheeses. Come expand your palate!",
    dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Bella's Bistro",
    hostId: "user-bella",
    attendeeIds: ["user-molly", "user-penny", "user-charlie"],
  },
  {
    publicId: nanoId(),
    title: "Fondue Friday",
    description:
      "Monthly fondue night! Bring your favorite dippers, cheese provided.",
    dateTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Gary's Gourmet Gallery",
    hostId: "user-gary",
    attendeeIds: ["user-bella", "user-charlie", "user-molly"],
  },
  {
    publicId: nanoId(),
    title: "Grilled Cheese Competition",
    description:
      "Who can make the ultimate grilled cheese? Join us to compete or just taste!",
    dateTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
    timeZone: "Europe/Oslo",
    place: "Penny's Pantry",
    hostId: "user-penny",
    attendeeIds: ["user-gary", "user-molly", "user-charlie"],
  },
];
