import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { profileSchema } from "../../../utils/formValidation";

export const usersRouter = createTRPCRouter({
  updateProfile: publicProcedure
    .input(
      profileSchema.extend({
        userId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...profile } = input;

      const userInDb = await ctx.db.user.update({
        where: { id: userId },
        data: { ...profile },
      });

      return userInDb;
    }),
});
