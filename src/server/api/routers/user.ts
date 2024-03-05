import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getByName: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findFirst({
        where: { name: input.name },
      });
    }),
});
