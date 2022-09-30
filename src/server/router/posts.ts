import { createRouter } from "./context";
import { z } from "zod";
import { postSchema } from "@/features/post/formValidation";

const idStringToNumber = z.string().transform(Number);

export const postsRouter = createRouter()
  .mutation("post", {
    input: postSchema.extend({
      authorId: z.string().cuid(),
      eventId: idStringToNumber,
    }),
    async resolve({ ctx, input }) {
      const { eventId, authorId, ...post } = input;

      const postInDb = await ctx.prisma.posts.create({
        data: {
          ...post,
          events: { connect: { eventId: eventId } },
          author: { connect: { id: authorId } },
        },
      });

      return postInDb;
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
        include: { author: true },
      });
    },
  });
