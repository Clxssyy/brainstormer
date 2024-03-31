import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getByName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findFirst({
        where: { name: input.name },
        include: {
          posts: true,
          followers: true,
          following: true,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
          },
          followers: true,
          following: {
            include: {
              follows: {
                include: {
                  posts: {
                    include: {
                      createdBy: true,
                      likes: true,
                      comments: true,
                    },
                    where: {
                      published: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              follows: {
                name: "asc",
              },
            },
          },
        },
      });
    }),

  getFollows: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findMany({
        where: { id: { in: input.ids } },
        include: {
          followers: true,
          following: true,
        },
      });
    }),

  follow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userFollows.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          follows: { connect: { id: input.id } },
        },
      });
    }),

  unfollow: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userFollows.deleteMany({
        where: {
          userId: ctx.session.user.id,
          followsId: input.id,
        },
      });
    }),
});
