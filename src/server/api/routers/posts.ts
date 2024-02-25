import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { postSchema } from "../../../utils/formValidation";

export const postsRouter = createTRPCRouter({
  post: publicProcedure
    .input(
      postSchema.extend({ authorId: z.string().cuid(), eventId: z.number() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { eventId, authorId, ...post } = input;

      const postInDb = await ctx.db.post.create({
        data: {
          ...post,
          event: { connect: { eventId } },
          author: { connect: { id: authorId } },
        },
      });
      await ctx.res?.revalidate(`/events/${eventId}`);

      return postInDb;
    }),
  posts: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          eventId: input.eventId,
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
      await ctx.res?.revalidate(`/events/${post.eventId}`);

      return post;
    }),
});
