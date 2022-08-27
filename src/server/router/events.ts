import { createRouter } from "./context";
import { z } from "zod";
import { attendEventSchema } from "@/features/event/formValidation";

export const eventsRouter = createRouter()
  .mutation("create-event", {
    input: z.object({
      title: z.string(),
      time: z.string(),
      place: z.string().optional(),
      description: z.string(),
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { userId, ...event } = input;

      const eventInDb = await ctx.prisma.events.create({
        data: { ...event, host: { connect: { id: userId } } },
      });

      return {
        event: eventInDb,
      };
    },
  })
  .query("events", {
    async resolve({ ctx }) {
      return await ctx.prisma.events.findMany();
    },
  })
  .query("event", {
    input: z.object({
      eventId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.events.findFirst({
        where: {
          eventId: Number.parseInt(input.eventId),
        },
        include: { host: true },
      });
    },
  })
  .query("events-attended-by-user", {
    input: z.object({
      userEmail: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.events.findMany({
        where: {
          attendees: {
            some: {
              email: input.userEmail,
            },
          },
        },
        include: { host: true },
      });
    },
  })
  .query("events-hosted-by-user", {
    input: z.object({
      userEmail: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.events.findMany({
        where: {
          host: {
            email: input.userEmail,
          },
        },
        include: { host: true },
      });
    },
  })
  .mutation("attend", {
    input: attendEventSchema.extend({ eventId: z.number() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.events.update({
        where: {
          eventId: input.eventId,
        },
        data: {
          attendees: {
            create: {
              name: input.name,
              email: input.email,
            },
          },
        },
      });
    },
  })
  .query("attendees", {
    input: z.object({
      eventId: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.attendees.findMany({
        where: {
          eventId: input.eventId,
        },
      });
    },
  });
