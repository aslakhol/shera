import { createRouter } from "./context";
import { z } from "zod";

export const eventsRouter = createRouter()
  .mutation("create-event", {
    input: z.object({
      title: z.string(),
      time: z.string(),
      place: z.string().optional(),
      description: z.string(),
    }),
    async resolve({ ctx, input }) {
      const eventInDb = await ctx.prisma.events.create({
        data: { ...input },
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
      });
    },
  });
