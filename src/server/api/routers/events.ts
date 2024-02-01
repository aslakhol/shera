import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { compareDesc } from "date-fns";
import { attendEventSchema, eventSchema } from "../../../utils/formValidation";

export const eventsRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(eventSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, ...event } = input;

      const eventInDb = await ctx.db.events.create({
        data: {
          ...event,
          host: { connect: { id: userId } },
        },
      });

      return {
        event: eventInDb,
      };
    }),
  updateEvent: publicProcedure
    .input(eventSchema.extend({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { eventId, ...event } = input;

      const eventInDb = await ctx.db.events.update({
        where: { eventId },
        data: { ...event },
      });
      return {
        event: eventInDb,
      };
    }),
  events: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.events.findMany();
  }),
  event: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input, ctx }) => {
      const event = await ctx.db.events.findFirst({
        where: {
          eventId: input.eventId,
        },
        include: { host: true },
      });

      // if (!event) {
      //   throw new trpc.TRPCError({
      //     code: "NOT_FOUND",
      //     message: `No event found with id ${input.eventId}`,
      //   });
      // }

      return event;
    }),
  eventsAttendedByUser: publicProcedure
    .input(z.object({ userEmail: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const eventsInDb = await ctx.db.events.findMany({
        where: {
          attendees: {
            some: {
              email: input.userEmail,
            },
          },
        },
        include: {
          host: true,
        },
      });

      return eventsInDb.sort((a, b) => compareDesc(a.dateTime, b.dateTime));
    }),
  eventsHostedByUser: publicProcedure
    .input(z.object({ userEmail: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const eventsInDb = await ctx.db.events.findMany({
        where: {
          host: {
            email: input.userEmail,
          },
        },
        include: {
          host: true,
        },
      });

      return eventsInDb.sort((a, b) => compareDesc(a.dateTime, b.dateTime));
    }),
  attend: publicProcedure
    .input(attendEventSchema.extend({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { eventId, ...attendee } = input;

      const eventInDb = await ctx.db.events.update({
        where: { eventId },
        data: { attendees: { create: { ...attendee } } },
      });

      return {
        event: eventInDb,
      };
    }),
  unattend: publicProcedure
    .input(z.object({ attendeeId: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const attendee = await ctx.db.attendees.delete({
        where: { attendeeId: input.attendeeId },
      });

      return {
        attendee,
      };
    }),
  attendees: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input, ctx }) => {
      const attendees = await ctx.db.attendees.findMany({
        where: { eventId: input.eventId },
      });

      return attendees;
    }),
});