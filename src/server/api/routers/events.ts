import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { compareDesc } from "date-fns";
import {
  attendEventSchema,
  eventSchema,
  loggedInAttendEventSchema,
} from "../../../utils/formValidation";
import { type User, type Prisma } from "@prisma/client";
import sgEmail from "@sendgrid/mail";
import { fullEventId } from "../../../utils/event";
import { env } from "../../../env";
import { getInviteEmail } from "../../../../emails/utils";
import { title } from "process";
import { type UserNetwork } from "../../../utils/types";

sgEmail.setApiKey(env.SENDGRID_API_KEY);

export const eventsRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(
      eventSchema.extend({
        userId: z.string(),
        hostName: z.string().optional(),
        hostEmail: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, hostName, hostEmail, ...event } = input;

      const eventInDb = await ctx.db.event.create({
        data: {
          ...event,
          publicId: ctx.nanoId(),
          host: { connect: { id: userId } },
          attendees: {
            create: {
              name: hostName ?? hostEmail ?? "Unknown",
              email: hostEmail,
              status: "GOING",
              userId: userId,
            },
          },
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
    return await ctx.db.event.findMany({
      include: { host: true, attendees: true },
    });
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

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    }),
  myEvents: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const attends: Prisma.EventWhereInput = {
        attendees: { some: { userId: input.userId } },
      };
      const hosts: Prisma.EventWhereInput = {
        host: { id: input.userId },
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
  updateAttendance: publicProcedure
    .input(
      z.object({
        publicId: z.string(),
        userId: z.string().cuid(),
        status: z.enum(["GOING", "NOT_GOING", "MAYBE"]),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { publicId, status, name } = input;

      const event = await ctx.db.event.findFirst({
        where: { publicId },
      });
      if (!event) {
        throw new Error("Event not found");
      }
      const path = fullEventId(event);

      const user = await ctx.db.user.findFirst({
        where: { id: input.userId },
      });

      if (!user) {
        throw new Error("User not found, are you logged in?");
      }

      const shouldUpdateUserName =
        name && !name.includes("@") && (!user.name || user.name.includes("@"));
      if (shouldUpdateUserName) {
        await ctx.db.user.update({
          where: { id: user.id },
          data: { name: name },
        });
      }

      const attendeeFromBeforeUser = await ctx.db.attendee.findFirst({
        where: {
          eventId: event.eventId,
          user: null,
          email: user.email,
        },
      });

      if (attendeeFromBeforeUser) {
        const attendee = await ctx.db.attendee.update({
          where: { attendeeId: attendeeFromBeforeUser.attendeeId },
          data: {
            status,
            name: name ?? user.name ?? "Unknown",
            email: user.email,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        await ctx.res?.revalidate(`/events/${path}`);
        return attendee;
      }

      const attendee = await ctx.db.attendee.upsert({
        where: {
          eventId_userId: { eventId: event.eventId, userId: user.id },
        },
        create: {
          eventId: event.eventId,
          userId: user.id,
          name: name ?? user.name ?? "Unknown",
          email: user.email,
          status,
        },
        update: {
          status,
          name: name ?? user.name ?? "Unknown",
          email: user.email,
        },
      });

      await ctx.res?.revalidate(`/events/${path}`);
      return attendee;
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
  loggedInAttend: publicProcedure
    .input(
      loggedInAttendEventSchema.extend({
        publicId: z.string(),
      }),
    )
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
  reattend: publicProcedure
    .input(z.object({ attendeeId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { attendeeId } = input;

      const attendeeInDb = await ctx.db.attendee.update({
        where: { attendeeId },
        data: { status: "GOING" },
        include: { event: true },
      });

      const path = fullEventId(attendeeInDb.event);
      await ctx.res?.revalidate(`/events/${path}`);

      return {
        attendee: attendeeInDb,
      };
    }),
  unattend: publicProcedure
    .input(z.object({ attendeeId: z.string().cuid() }))
    .mutation(async ({ input, ctx }) => {
      const attendeeInDb = await ctx.db.attendee.findFirst({
        where: { attendeeId: input.attendeeId },
      });

      if (!attendeeInDb) {
        throw new Error("Attendee not found");
      }

      if (attendeeInDb.userId) {
        const updatedAttendee = await ctx.db.attendee.update({
          where: { attendeeId: input.attendeeId },
          data: { status: "NOT_GOING" },
          include: { event: true },
        });

        const path = fullEventId(updatedAttendee.event);
        await ctx.res?.revalidate(`/events/${path}`);

        return {
          attendee: updatedAttendee,
        };
      }

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
  network: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const attends: Prisma.EventWhereInput = {
        attendees: { some: { userId: input.userId } },
      };
      const hosts: Prisma.EventWhereInput = {
        host: { id: input.userId },
      };
      const myEvents = await ctx.db.event.findMany({
        where: {
          OR: [hosts, attends],
        },
        include: {
          attendees: true,
        },
        orderBy: { dateTime: "desc" },
      });

      if (myEvents.length === 0) {
        return [];
      }

      const userNetwork: UserNetwork = myEvents.reduce((acc, event) => {
        const attendees = event.attendees
          .filter((a) => a.userId !== input.userId)
          .filter((a) => a.status !== "NOT_GOING");
        if (attendees.length === 0) {
          return acc;
        }

        const existingUpdated: UserNetwork = acc.map((userInNetwork) => {
          const isAttendee = attendees.find(
            (a) => a.userId === userInNetwork.userId,
          );

          if (!isAttendee) {
            return userInNetwork;
          }

          return {
            ...userInNetwork,
            events: [
              ...userInNetwork.events,
              { publicId: event.publicId, title: event.title },
            ],
          };
        });

        const notAlreadyInNetwork: UserNetwork = attendees
          .filter((a) => !existingUpdated.find((u) => u.userId === a.userId))
          .filter((a) => a.email !== null && a.userId !== null)
          .map((attendee) => ({
            userId: attendee.userId!,
            name: attendee.name,
            events: [
              {
                publicId: event.publicId,
                title: event.title,
              },
            ],
          }));

        return [...existingUpdated, ...notAlreadyInNetwork];
      }, [] as UserNetwork);

      return userNetwork;
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
  invite: publicProcedure
    .input(
      z.object({
        publicId: z.string(),
        emails: z.array(z.string().email()),
        inviterName: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { publicId, emails, inviterName } = input;

      const event = await ctx.db.event.findFirst({
        where: {
          publicId: publicId,
        },
        include: { attendees: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const notAlreadyAttending = emails.filter((email) =>
        event.attendees.some((a) => a.email !== email),
      );

      if (notAlreadyAttending.length === 0) {
        throw new Error("All invitees are already attending");
      }

      const existingUsers = await ctx.db.user.findMany({
        where: { email: { in: notAlreadyAttending } },
      });
      const hasNoExistingUser = notAlreadyAttending.filter((email) =>
        existingUsers.every((user) => user.email !== email),
      );

      const { fromExistingUsers, fromHasNoExistingUser } =
        await ctx.db.$transaction(async (tx) => {
          const fromExistingUsers = await tx.attendee.createMany({
            data: existingUsers.map((user) => ({
              eventId: event.eventId,
              userId: user.id,
              name: user.name ?? user.email ?? "Unknown",
              email: user.email,
              status: "INVITED",
            })),
          });

          const fromHasNoExistingUser = await tx.attendee.createMany({
            data: hasNoExistingUser.map((email) => ({
              eventId: event.eventId,
              userId: null,
              name: email,
              email,
              status: "INVITED",
            })),
          });

          return {
            fromExistingUsers: fromExistingUsers.count,
            fromHasNoExistingUser: fromHasNoExistingUser.count,
          };
        });

      const path = fullEventId(event);
      await ctx.res?.revalidate(`/events/${path}`);

      const inviteEmail = getInviteEmail(
        event,
        notAlreadyAttending,
        inviterName,
      );
      await sgEmail.sendMultiple(inviteEmail);

      return {
        fromExistingUsers,
        fromHasNoExistingUser,
        alreadyAttending: emails.length - notAlreadyAttending.length,
        totalInvites:
          fromExistingUsers +
          fromHasNoExistingUser +
          emails.length -
          notAlreadyAttending.length,
      };
    }),
  networkInvite: publicProcedure
    .input(
      z.object({
        publicId: z.string(),
        friendsUserIds: z.array(z.string()),
        inviterName: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { publicId, friendsUserIds, inviterName } = input;

      const event = await ctx.db.event.findFirst({
        where: {
          publicId: publicId,
        },
        include: { attendees: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const notAlreadyAttending = friendsUserIds.filter((id) =>
        event.attendees.some((a) => a.userId !== id),
      );

      if (notAlreadyAttending.length === 0) {
        throw new Error("All invitees are already attending");
      }

      const friends = await ctx.db.user.findMany({
        where: { id: { in: notAlreadyAttending }, email: { not: null } },
      });

      await ctx.db.attendee.createMany({
        data: friends.map((friend) => ({
          eventId: event.eventId,
          userId: friend.id,
          name: friend.name ?? friend.email ?? "Unknown",
          email: friend.email,
          status: "INVITED",
        })),
      });

      const path = fullEventId(event);
      await ctx.res?.revalidate(`/events/${path}`);

      const friendEmails = friends
        .map((friend) => friend.email)
        .filter((email): email is string => !!email);

      const inviteEmail = getInviteEmail(event, friendEmails, inviterName);
      await sgEmail.sendMultiple(inviteEmail);

      return {
        invites: friends.length,
        alreadyAttending: friendsUserIds.length - notAlreadyAttending.length,
      };
    }),
});
