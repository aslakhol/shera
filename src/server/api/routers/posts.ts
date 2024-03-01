import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { postSchema } from "../../../utils/formValidation";
import { fullEventId } from "../../../utils/event";

export const postsRouter = createTRPCRouter({
  post: publicProcedure
    .input(
      postSchema.extend({ authorId: z.string().cuid(), publicId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { publicId, authorId, ...post } = input;

      const postInDb = await ctx.db.post.create({
        data: {
          ...post,
          event: { connect: { publicId } },
          author: { connect: { id: authorId } },
        },
        include: { event: true },
      });

      const path = fullEventId(postInDb.event);
      await ctx.res?.revalidate(`/events/${path}`);

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
        include: { author: true, event: true },
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
