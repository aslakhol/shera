import { createRouter } from "./context";
import { z } from "zod";

const idStringToNumber = z.string().transform(Number);

export const postsRouter = createRouter()
  .mutation("post", {
    input: z.object({
      title: z.string(),
      content: z.string(),
      authorEmail: z.string(),
      authorName: z.string(),
      eventId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { eventId, ...post } = input;

      const postInDb = await ctx.prisma.posts.create({
        data: {
          ...post,
          events: { connect: { eventId: idStringToNumber.parse(eventId) } },
        },
      });

      return {
        postInDb,
      };
    },
  })
  .query("posts", {
    input: z.object({
      eventId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.posts.findMany({
        where: {
          eventsId: idStringToNumber.parse(input.eventId),
        },
      });
    },
  });
