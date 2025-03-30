import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { postSchema } from "../../../utils/formValidation";
import { fullEventId } from "../../../utils/event";
import { getNewPostEmail } from "../../../../emails/getEmails";
import { emailClient } from "../../../server/email";

export const postsRouter = createTRPCRouter({
  post: publicProcedure
    .input(
      postSchema.extend({ authorId: z.string().cuid(), publicId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { publicId, authorId, notify, ...post } = input;

      const postInDb = await ctx.db.post.create({
        data: {
          ...post,
          event: { connect: { publicId } },
          author: { connect: { id: authorId } },
        },
        include: {
          event: {
            include: { attendees: true, hosts: true },
          },
          author: true,
        },
      });

      const path = fullEventId(postInDb.event);
      await ctx.res?.revalidate(`/events/${path}`);

      if (notify) {
        const posterIsHost = postInDb.event.hosts.some(
          (host) => host.id === postInDb.author.id,
        );

        const attendeeEmails = postInDb.event.attendees
          .filter(
            (attendee) =>
              attendee.status === "GOING" || attendee.status === "MAYBE",
          )
          .map((attendee) => attendee.email)
          .filter((email) => email !== null)
          .filter((email) => email !== postInDb.author.email);

        const hostEmails = postInDb.event.hosts
          .map((host) => host.email)
          .filter((email) => email !== null)
          .filter((email) => email !== postInDb.author.email);

        const emails = posterIsHost ? attendeeEmails : hostEmails;

        if (emails.length > 0) {
          const newPostEmail = getNewPostEmail(
            postInDb.message,
            postInDb.event,
            emails,
            postInDb.author,
          );

          await emailClient.send(newPostEmail);
        }
      }

      return postInDb;
    }),
  posts: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.event.findFirst({
        where: {
          publicId: input.publicId,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const posts = await ctx.db.post.findMany({
        where: {
          eventId: event.eventId,
        },
        include: { author: true, event: { include: { hosts: true } } },
      });

      return posts.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    }),

  deletePost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.delete({
        where: {
          postId: input.postId,
        },
        include: { event: true },
      });
      const path = fullEventId(post.event);
      await ctx.res?.revalidate(`/events/${path}`);

      return post;
    }),
});
