import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { compareDesc } from "date-fns";
import { attendEventSchema, eventSchema } from "../../../utils/formValidation";
import { type Prisma } from "@prisma/client";

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
    .input(eventSchema.extend({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { eventId, ...event } = input;

      const eventInDb = await ctx.db.event.update({
        where: { eventId },
        data: { ...event },
      });

      await ctx.res?.revalidate(`/events/${eventId}`);

      return {
        event: eventInDb,
      };
    }),
  events: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany();
  }),
  event: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input, ctx }) => {
      const event = await ctx.db.event.findFirst({
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
    .input(attendEventSchema.extend({ eventId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { eventId, ...attendee } = input;

      const eventInDb = await ctx.db.event.update({
        where: { eventId },
        data: { attendees: { create: { ...attendee } } },
      });
      await ctx.res?.revalidate(`/events/${eventId}`);

      return {
        event: eventInDb,
      };
    }),
  unattend: publicProcedure
    .input(z.object({ attendeeId: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const attendee = await ctx.db.attendee.delete({
        where: { attendeeId: input.attendeeId },
      });
      await ctx.res?.revalidate(`/events/${attendee.eventId}`);

      return {
        attendee,
      };
    }),
  attendees: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input, ctx }) => {
      const attendees = await ctx.db.attendee.findMany({
        where: { eventId: input.eventId },
      });

      return attendees;
    }),
  assignPublicId: publicProcedure.mutation(async ({ ctx }) => {
    const eventsToUpdate = await ctx.db.event.findMany({
      where: { publicId: null },
    });

    if (eventsToUpdate.length === 0) {
      throw new Error("No events to update");
    }

    const updatedFirstEvent = await ctx.db.event.update({
      where: { eventId: eventsToUpdate[0]!.eventId },
      data: { publicId: ctx.nanoId() },
    });

    return updatedFirstEvent;
  }),
});
