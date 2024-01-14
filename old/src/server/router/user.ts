import { createRouter } from "./context";
import { z } from "zod";
import { profileSchema } from "@/features/profile/formValidation";

export const usersRouter = createRouter().mutation("update-profile", {
  input: profileSchema.extend({
    userId: z.string().cuid(),
  }),
  async resolve({ ctx, input }) {
    const { userId, ...profile } = input;

    const userInDb = await ctx.prisma.user.update({
      where: { id: userId },
      data: { ...profile },
    });

    return userInDb;
  },
});
