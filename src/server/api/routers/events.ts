import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { compareDesc } from "date-fns";
import { attendEventSchema, eventSchema } from "../../../utils/formValidation";
import { type Prisma } from "@prisma/client";
import { fullEventId } from "../../../utils/event";

export const eventsRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(eventSchema.extend({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, ...event } = input;

      const eventInDb = await ctx.db.event.create({
        data: {
          ...event,
          publicId: ctx.nanoId(),
          host: { connect: { id: userId } },
        },
      });

      return {
        event: eventInDb,
      };
    }),
  updateEvent: publicProcedure
    .input(eventSchema.extend({ publicId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { publicId, ...event } = input;

      const eventInDb = await ctx.db.event.update({
        where: { publicId },
        data: { ...event },
      });

      const path = fullEventId(eventInDb);
      await ctx.res?.revalidate(`/events/${path}`);

      return {
        event: eventInDb,
      };
    }),
  events: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany();
  }),
  event: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ input, ctx }) => {
      const event = await ctx.db.event.findFirst({
        where: {
          publicId: input.publicId,
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
  myEvents: publicProcedure
    .input(z.object({ userEmail: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const attends: Prisma.EventWhereInput = {
        attendees: { some: { email: input.userEmail } },
      };
      const hosts: Prisma.EventWhereInput = {
        host: { email: input.userEmail },
      };

      const eventsInDb = await ctx.db.event.findMany({
        where: {
          OR: [hosts, attends],
        },
        include: {
          host: true,
          attendees: true,
        },
      });

      return eventsInDb.sort((a, b) => compareDesc(a.dateTime, b.dateTime));
    }),
  attend: publicProcedure
    .input(attendEventSchema.extend({ publicId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { publicId, ...attendee } = input;

      const eventInDb = await ctx.db.event.update({
        where: { publicId },
        data: { attendees: { create: { ...attendee } } },
      });

      const path = fullEventId(eventInDb);
      await ctx.res?.revalidate(`/events/${path}`);

      return {
        event: eventInDb,
      };
    }),
  unattend: publicProcedure
    .input(z.object({ attendeeId: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const attendee = await ctx.db.attendee.delete({
        where: { attendeeId: input.attendeeId },
        include: { event: true },
      });
      const path = fullEventId(attendee.event);
      await ctx.res?.revalidate(`/events/${path}`);

      return {
        attendee,
      };
    }),
  attendees: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ input, ctx }) => {
      const event = await ctx.db.event.findFirst({
        where: {
          publicId: input.publicId,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const attendees = await ctx.db.attendee.findMany({
        where: { eventId: event.eventId },
      });

      return attendees;
    }),
});
