import { PrismaClient } from "@prisma/client";
import { users, events } from "./seed.data";
import { env } from "../src/env";

const prisma = new PrismaClient();

async function main() {
  // Check for production environment
  if (env.NODE_ENV === "production") {
    throw new Error("🚫 Seed script should not be run in production");
  }

  console.log("🌱 Starting seed script...");

  // Create users
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      }),
    ),
  );

  console.log("Created users:", createdUsers.map((u) => u.name).join(", "));

  // Create events with hosts and attendees
  const createdEvents = await Promise.all(
    events.map(async (event) => {
      const created = await prisma.event.create({
        data: {
          publicId: event.publicId,
          title: event.title,
          description: event.description,
          dateTime: event.dateTime,
          timeZone: "Europe/Oslo",
          place: event.place,
          hostId: event.hostId,
          attendees: {
            create: event.attendeeIds.map((userId) => ({
              name: users.find((u) => u.id === userId)?.name ?? "Unknown",
              email: users.find((u) => u.id === userId)?.email ?? "",
              userId,
            })),
          },
        },
      });
      return created;
    }),
  );

  console.log("Created events:", createdEvents.map((e) => e.title).join(", "));

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
