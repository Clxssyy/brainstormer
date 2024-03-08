import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullish(),
        published: z.boolean().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
          description: input.description ?? "",
          published: input.published ?? false,
        },
      });
    }),

  getLatest: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        take: input.amount,
        include: { createdBy: true },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { id: Number(input.id) },
        include: { createdBy: true },
      });
    }),

  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().nullish(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        direction: z.enum(["asc", "desc"]).nullish(),
      }),
    )
    .query(async (opts) => {
      const { ctx, input } = opts;
      const limit = input.limit ?? 8;
      const cursor = input.cursor;
      const direction = input.direction;
      const published = input.published ?? true;
      const page = await ctx.db.post.findMany({
        orderBy: { id: direction ?? "desc" },
        take: limit + 1,
        skip: 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: { createdBy: true },
        where: { published: published },
      });
      const items = page.reverse();
      let nextCursor: typeof cursor | null = null;
      const hasMore = items.length > limit;
      if (hasMore) {
        const nextItem = items.shift();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getAllById: publicProcedure
    .input(
      z.object({
        published: z.boolean().nullish(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        direction: z.enum(["asc", "desc"]).nullish(),
        id: z.string(),
      }),
    )
    .query(async (opts) => {
      const { ctx, input } = opts;
      const limit = input.limit ?? 10;
      const cursor = input.cursor;
      const direction = input.direction;
      const published = input.published ?? true;
      const page = await ctx.db.post.findMany({
        orderBy: { id: direction ?? "desc" },
        take: limit + 1,
        skip: 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: { createdBy: true },
        where: { published: published, createdById: input.id },
      });
      const items = page.reverse();
      let nextCursor: typeof cursor | null = null;
      const hasMore = items.length > limit;
      if (hasMore) {
        const nextItem = items.shift();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getMany: publicProcedure
    .input(z.object({ amount: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        take: input.amount,
      });
    }),
});
