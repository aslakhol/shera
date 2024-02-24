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

      const postInDb = await ctx.db.posts.create({
        data: {
          ...post,
          events: { connect: { eventId } },
          author: { connect: { id: authorId } },
        },
      });

      return postInDb;
    }),
  posts: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.posts.findMany({
        where: {
          eventsId: input.eventId,
        },
        include: { author: true, events: true },
      });

      return posts.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    }),

  deletePost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.posts.delete({
        where: {
          postId: input.postId,
        },
      });

      return post;
    }),
});
