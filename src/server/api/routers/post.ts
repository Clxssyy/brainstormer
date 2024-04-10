import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handlePrompt = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a creative writer. When given a brief explanation of an idea, you should provide two possible next steps for the story to continue in. These next steps should be short and simple. Please put each next step on a new line. The format should be: <next step 1>\n<next step 2>",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0]?.message.content;

  return response?.split("\n");
};

const handleImagePrompt = async (prompt: string) => {
  const completion = await openai.images.generate({
    prompt: prompt,
    model: "dall-e-2",
    n: 1,
  });

  return completion.data[0]?.url ?? "/default-avatar.jpg";
};

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userPostCount = await ctx.db.post.count({
        where: { createdBy: { id: ctx.session.user.id } },
      });

      return ctx.db.post
        .create({
          data: {
            name: "Brainstorm #" + (userPostCount + 1),
            createdBy: {
              connect: { id: ctx.session.user.id },
            },
          },
        })
        .then((post) => {
          return ctx.db.page.create({
            data: {
              content: input.prompt,
              post: {
                connect: { id: post.id },
              },
              number: 1,
            },
          });
        })
        .then(async (page) => {
          const choices = await handlePrompt(input.prompt);
          const post = await ctx.db.post.findUnique({
            where: { id: page.postId },
            include: {
              createdBy: true,
              pages: true,
              likes: true,
              comments: true,
            },
          });
          return {
            choices: choices,
            post: post,
          };
        });
    }),

  getChoices: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .query(async ({ input }) => {
      return handlePrompt(input.prompt);
    }),

  addPage: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string(),
        number: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.page
        .create({
          data: {
            content: input.content,
            post: {
              connect: { id: input.postId },
            },
            number: input.number,
          },
        })
        .then(async () => {
          const choices = await handlePrompt(input.content);
          return {
            choices: choices,
          };
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
        include: {
          createdBy: true,
          pages: {
            orderBy: { createdAt: "asc" },
          },
          likes: true,
          comments: true,
        },
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
        include: { createdBy: true, likes: true, comments: true },
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
      const published = input.published ?? undefined;
      const page = await ctx.db.post.findMany({
        orderBy: { id: direction ?? "desc" },
        take: limit + 1,
        skip: 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: { createdBy: true, likes: true, comments: true },
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

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.page.deleteMany({
        where: { postId: input.id },
      });
      await ctx.db.like.deleteMany({
        where: { postId: input.id },
      });
      await ctx.db.comment.deleteMany({
        where: { postId: input.id },
      });
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).nullish(),
        description: z.string().nullish(),
        published: z.boolean().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: Number(input.id) },
        data: {
          name: input.name ?? undefined,
          description: input.description ?? undefined,
          published: input.published ?? undefined,
        },
      });
    }),

  like: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.create({
        data: {
          post: {
            connect: { id: input.id },
          },
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  unlike: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.deleteMany({
        where: {
          postId: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  comment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.content,
          post: {
            connect: { id: input.id },
          },
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  updatePage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        image: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.page.update({
        where: {
          id: input.id,
        },
        data: {
          image: input.image,
          content: input.content,
        },
      });
    }),

  generateImage: protectedProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .query(async ({ input }) => {
      return handleImagePrompt(input.prompt);
    }),

  setImage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        image: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.page.update({
        where: {
          id: input.id,
        },
        data: {
          image: await handleImagePrompt(input.image),
        },
      });
    }),
});
