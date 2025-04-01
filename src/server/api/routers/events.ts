import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { compareDesc, isSameDay, isSameHour, isSameMinute } from "date-fns";
import { eventSchema } from "../../../utils/formValidation";
import { type Prisma } from "@prisma/client";
import { fullEventId } from "../../../utils/event";
import {
  getConfirmationEmail,
  getInviteEmail,
  getUpdatedEventEmail,
  getHostInviteEmail,
} from "../../../../emails/getEmails";
import { type UserNetwork } from "../../../utils/types";
import { formatInTimeZone } from "date-fns-tz";
import { emailClient } from "../../../server/email";

export const eventsRouter = createTRPCRouter({
  createEvent: publicProcedure
    .input(
      eventSchema.extend({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, notify, ...event } = input;

      if (notify) {
        throw new Error(
          "Notify is not allowed to be true when creating an event",
        );
      }

      const host = await ctx.db.user.findFirst({
        where: { id: userId },
      });

      const eventInDb = await ctx.db.event.create({
        data: {
          ...event,
          publicId: ctx.nanoId(),
          hosts: { connect: [{ id: userId }] },
          attendees: {
            create: {
              name: host?.name ?? host?.email ?? "Unknown",
              email: host?.email,
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
      const { publicId, notify, ...event } = input;

      const oldEvent = await ctx.db.event.findFirstOrThrow({
        where: { publicId },
      });

      const eventInDb = await ctx.db.event.update({
        where: { publicId },
        data: { ...event },
        include: { attendees: true, hosts: true },
      });

      const titleChanged =
        oldEvent?.title !== eventInDb.title
          ? `The title changed from "${oldEvent.title}" to "${eventInDb.title}".`
          : undefined;
      const descriptionChanged =
        oldEvent.description !== eventInDb.description
          ? `The description was updated.`
          : undefined;
      const placeChanged =
        oldEvent.place !== eventInDb.place
          ? `The place changed from "${oldEvent.place}" to "${eventInDb.place}".`
          : undefined;
      const dateChanged = !isSameDay(oldEvent.dateTime, eventInDb.dateTime)
        ? `The date changed from "${formatInTimeZone(
            oldEvent.dateTime,
            oldEvent.timeZone,
            "LLLL do",
          )}" to "${formatInTimeZone(
            eventInDb.dateTime,
            eventInDb.timeZone,
            "LLLL do",
          )}"`
        : undefined;
      const timeChanged =
        !isSameHour(oldEvent.dateTime, eventInDb.dateTime) ||
        !isSameMinute(oldEvent.dateTime, eventInDb.dateTime)
          ? `The time changed from "${formatInTimeZone(
              oldEvent.dateTime,
              oldEvent.timeZone,
              "h:mm",
            )}" to "${formatInTimeZone(
              eventInDb.dateTime,
              eventInDb.timeZone,
              "h:mm",
            )}"`
          : undefined;

      const changes = [
        titleChanged,
        descriptionChanged,
        placeChanged,
        dateChanged,
        timeChanged,
      ].filter((change): change is string => !!change);

      // TODO: Update this so that instead of not notifying the host, we only skip notifying the person who made the change.
      if (notify && changes.length > 0) {
        const attendeeEmails = eventInDb.attendees
          .filter(
            (attendee) =>
              attendee.status === "GOING" || attendee.status === "MAYBE",
          )
          .map((attendee) => attendee.email)
          .filter((email) => email !== null);
        // .filter((email) => email !== eventInDb.host.email);

        if (attendeeEmails.length > 0) {
          const updatedEventEmail = getUpdatedEventEmail(
            eventInDb,
            changes,
            attendeeEmails,
          );

          await emailClient.send(updatedEventEmail);
        }
      }

      const path = fullEventId(eventInDb);
      await ctx.res?.revalidate(`/events/${path}`);

      return {
        event: eventInDb,
      };
    }),
  events: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      include: { hosts: true, attendees: true },
    });
  }),
  event: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ input, ctx }) => {
      const event = await ctx.db.event.findFirst({
        where: {
          publicId: input.publicId,
        },
        include: { hosts: true },
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
        hosts: { some: { id: input.userId } },
      };

      const eventsInDb = await ctx.db.event.findMany({
        where: {
          OR: [hosts, attends],
        },
        include: {
          hosts: true,
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
        include: { hosts: true, attendees: true },
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
      const previousStatus = event.attendees.find(
        (a) => a.userId === user.id,
      )?.status;
      const shouldGetConfirmationEmail =
        previousStatus !== status &&
        previousStatus !== "GOING" &&
        (status === "GOING" || status === "MAYBE");
      if (user.email && shouldGetConfirmationEmail) {
        const inviteEmail = getConfirmationEmail(event, user.email, status);
        await emailClient.send(inviteEmail);
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
  network: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const attends: Prisma.EventWhereInput = {
        attendees: { some: { userId: input.userId } },
      };
      const hosts: Prisma.EventWhereInput = {
        hosts: { some: { id: input.userId } },
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
        orderBy: {
          updatedAt: "asc",
        },
      });

      return attendees;
    }),
  emailInvite: publicProcedure
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

      const inviteEvent = await ctx.db.event.findFirst({
        where: { publicId: event.publicId },
        include: { hosts: true, attendees: true },
      });

      if (!inviteEvent) {
        throw new Error("Event suddenly dissapeared");
      }

      const inviteEmail = getInviteEmail(
        inviteEvent,
        notAlreadyAttending,
        inviterName,
      );
      await emailClient.sendMultiple(inviteEmail);

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

      const inviteEvent = await ctx.db.event.findFirst({
        where: { publicId: event.publicId },
        include: { hosts: true, attendees: true },
      });

      if (!inviteEvent) {
        throw new Error("Event suddenly dissapeared");
      }

      const inviteEmail = getInviteEmail(
        inviteEvent,
        friendEmails,
        inviterName,
      );
      await emailClient.sendMultiple(inviteEmail);

      return {
        invites: friends.length,
        alreadyAttending: friendsUserIds.length - notAlreadyAttending.length,
      };
    }),
  removeHost: protectedProcedure
    .input(
      z.object({
        publicId: z.string(),
        userIdToRemove: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { publicId, userIdToRemove } = input;
      const currentUserId = ctx.session.user.id;

      const event = await ctx.db.event.findFirst({
        where: { publicId },
        include: { hosts: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const currentUserIsHost = event.hosts.some(
        (host) => host.id === currentUserId,
      );
      if (!currentUserIsHost) {
        throw new Error("Only hosts can remove other hosts");
      }

      const hostExists = event.hosts.some((host) => host.id === userIdToRemove);
      if (!hostExists) {
        throw new Error("User is not a host of this event");
      }

      if (event.hosts.length <= 1) {
        throw new Error("Cannot remove the last host from an event");
      }

      const updatedEvent = await ctx.db.event.update({
        where: { eventId: event.eventId },
        data: {
          hosts: {
            disconnect: [{ id: userIdToRemove }],
          },
        },
        include: { hosts: true },
      });

      const path = fullEventId(event);
      await ctx.res?.revalidate(`/events/${path}`);

      return {
        event: updatedEvent,
      };
    }),
  emailInviteHost: protectedProcedure
    .input(
      z.object({
        publicId: z.string(),
        emails: z.array(z.string().email()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { publicId, emails } = input;
      const inviterId = ctx.session.user.id;
      const inviter = ctx.session.user;

      const event = await ctx.db.event.findFirst({
        where: { publicId },
        include: { hosts: true, attendees: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (!event.hosts.some((host) => host.id === inviterId)) {
        throw new Error("Only hosts can invite other hosts");
      }

      const existingUsers = await ctx.db.user.findMany({
        where: { email: { in: emails } },
      });

      let createdCount = 0;
      const sentEmails: string[] = [];
      const failedEmails: { email: string; reason: string }[] = [];

      for (const email of emails) {
        const normalizedEmail = email.toLowerCase();
        const existingUser = existingUsers.find(
          (u) => u.email?.toLowerCase() === normalizedEmail,
        );

        if (existingUser && event.hosts.some((h) => h.id === existingUser.id)) {
          console.log(`User ${email} is already a host.`);
          failedEmails.push({ email, reason: "Already a host" });
          continue;
        }

        try {
          const newInvitation = await ctx.db.hostInvitation.create({
            data: {
              eventId: event.eventId,
              invitedUserEmail: normalizedEmail,
              inviterId: inviterId,
              invitedUserId: existingUser?.id,
            },
          });

          const emailToSend = getHostInviteEmail(
            event,
            [normalizedEmail],
            newInvitation.token,
            inviter.name ?? undefined,
          );

          await emailClient.send(emailToSend);
          sentEmails.push(normalizedEmail);
          createdCount++;
        } catch (error) {
          console.error(
            `Failed to create/send host invitation for ${email}:`,
            error,
          );
          failedEmails.push({ email, reason: "Failed to process invitation" });
        }
      }

      return {
        success: createdCount > 0,
        sentCount: createdCount,
        failed: failedEmails,
      };
    }),
  networkInviteHost: protectedProcedure
    .input(
      z.object({
        publicId: z.string(),
        inviteeIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { publicId, inviteeIds } = input;
      const inviterId = ctx.session.user.id;
      const inviter = ctx.session.user;

      const event = await ctx.db.event.findFirst({
        where: { publicId },
        include: { hosts: true, attendees: true },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      if (!event.hosts.some((host) => host.id === inviterId)) {
        throw new Error("Only hosts can invite other hosts");
      }

      const usersToInviteDetails = await ctx.db.user.findMany({
        where: { id: { in: inviteeIds } },
        select: { id: true, email: true, name: true },
      });

      let createdCount = 0;
      const sentUserIds: string[] = [];
      const failedUserIds: { userId: string; reason: string }[] = [];

      for (const user of usersToInviteDetails) {
        if (!user.email) {
          console.log(`User ${user.id} has no email, skipping invite.`);
          failedUserIds.push({ userId: user.id, reason: "Missing email" });
          continue;
        }

        if (event.hosts.some((host) => host.id === user.id)) {
          console.log(`User ${user.id} is already a host.`);
          failedUserIds.push({ userId: user.id, reason: "Already a host" });
          continue;
        }

        try {
          const newInvitation = await ctx.db.hostInvitation.create({
            data: {
              eventId: event.eventId,
              invitedUserEmail: user.email,
              invitedUserId: user.id,
              inviterId: inviterId,
            },
          });

          const emailToSend = getHostInviteEmail(
            event,
            [user.email],
            newInvitation.token,
            inviter.name ?? inviter.email ?? undefined,
          );

          await emailClient.send(emailToSend);
          sentUserIds.push(user.id);
          createdCount++;
        } catch (error) {
          console.error(
            `Failed to create/send host invitation for user ${user.id}:`,
            error,
          );
          failedUserIds.push({
            userId: user.id,
            reason: "Failed to process invitation",
          });
        }
      }

      return {
        success: createdCount > 0,
        sentCount: createdCount,
        failed: failedUserIds,
      };
    }),
  acceptHostInvite: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { token } = input;

      const invitation = await ctx.db.hostInvitation.findUniqueOrThrow({
        where: { token },
        include: { event: { include: { hosts: true } } },
      });

      if (
        invitation.event.hosts.some((h) => h.id === invitation.invitedUserId)
      ) {
        console.log(
          `User ${invitation.invitedUserId} is already a host for event ${invitation.event.publicId}. Deleting invite.`,
        );
        await ctx.db.hostInvitation.delete({ where: { id: invitation.id } });
        return {
          success: true,
          message: "Already a host",
          event: invitation.event,
        };
      }

      const currentUser = ctx.session.user;
      const isCorrectUserId = invitation.invitedUserId !== currentUser.id;
      const isCorrectEmail =
        currentUser.email?.toLowerCase() ===
        invitation.invitedUserEmail.toLowerCase();

      if (!isCorrectUserId && !isCorrectEmail) {
        throw new Error(`You are not authorized to accept this invitation.`);
      }

      await ctx.db.$transaction(async (tx) => {
        await tx.event.update({
          where: { eventId: invitation.event.eventId },
          data: {
            hosts: {
              connect: { id: currentUser.id },
            },
          },
        });
        await tx.hostInvitation.delete({ where: { id: invitation.id } });
      });

      const path = fullEventId(invitation.event);
      void ctx.res?.revalidate(`/events/${path}`);

      const updatedEvent = await ctx.db.event.findUniqueOrThrow({
        where: { eventId: invitation.event.eventId },
        include: { hosts: true },
      });

      return {
        success: true,
        message: "Invitation accepted!",
        event: updatedEvent,
      };
    }),
});
