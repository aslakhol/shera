import { createRouter } from "./context";
import { z } from "zod";
import { postSchema } from "@/features/post/formValidation";

export const postsRouter = createRouter()
  .mutation("post", {
    input: postSchema.extend({
      authorId: z.string().cuid(),
      eventId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { eventId, authorId, ...post } = input;

      const postInDb = await ctx.prisma.posts.create({
        data: {
          ...post,
          events: { connect: { eventId } },
          author: { connect: { id: authorId } },
        },
      });

      return postInDb;
    },
  })
  .query("posts", {
    input: z.object({
      eventId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const posts = await ctx.prisma.posts.findMany({
        where: {
          eventsId: input.eventId,
        },
        include: { author: true, events: true },
      });

      return posts.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    },
  })
  .mutation("deletePost", {
    input: z.object({
      postId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const post = await ctx.prisma.posts.delete({
        where: {
          postId: input.postId,
        },
      });
      return post;
    },
  });
