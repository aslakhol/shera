import { createRouter } from "./context";
import { z } from "zod";
import { attendEventSchema } from "@/features/event/formValidation";
import * as trpc from "@trpc/server";
import { eventSchema } from "@/features/eventForm/formValidation";
import { compareDesc } from "date-fns";

export const eventsRouter = createRouter()
  .mutation("create-event", {
    input: eventSchema.extend({ userId: z.string(), dateTime: z.date() }),
    async resolve({ ctx, input }) {
      const { userId, ...event } = input;

      const eventInDb = await ctx.prisma.events.create({
        data: {
          ...event,
          host: { connect: { id: userId } },
        },
      });

      return {
        event: eventInDb,
      };
    },
  })
  .mutation("update-event", {
    input: eventSchema.extend({ eventId: z.number(), dateTime: z.date() }),
    async resolve({ ctx, input }) {
      const { eventId, ...event } = input;

      const eventInDb = await ctx.prisma.events.update({
        where: { eventId },
        data: { ...event },
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
      eventId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const event = await ctx.prisma.events.findFirst({
        where: {
          eventId: input.eventId,
        },
        include: { host: true },
      });

      if (!event) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: `No event found with id ${input.eventId}`,
        });
      }

      return event;
    },
  })
  .query("events-attended-by-user", {
    input: z.object({
      userEmail: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const eventsInDb = await ctx.prisma.events.findMany({
        where: {
          attendees: {
            some: {
              email: input.userEmail,
            },
          },
        },
        include: { host: true },
      });

      return eventsInDb.sort((a, b) => compareDesc(a.dateTime, b.dateTime));
    },
  })
  .query("events-hosted-by-user", {
    input: z.object({
      userEmail: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const eventsInDb = await ctx.prisma.events.findMany({
        where: {
          host: {
            email: input.userEmail,
          },
        },
        include: { host: true },
      });

      return eventsInDb.sort((a, b) => compareDesc(a.dateTime, b.dateTime));
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
  .mutation("unattend", {
    input: z.object({ attendeeId: z.string().cuid() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.attendees.delete({
        where: {
          attendeeId: input.attendeeId,
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