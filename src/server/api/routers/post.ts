import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import OpenAI from "openai";
import { utapi } from "~/uploadthing/server";

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
    model: "dall-e-3",
    n: 1,
  });

  if (!completion.data[0]?.url) {
    return "/default-avatar.jpg";
  }

  const res = await utapi.uploadFilesFromUrl(completion.data[0]?.url);

  const url = res.data?.url;

  if (!url) {
    return "/default-avatar.jpg";
  }

  return url;
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
          // const choices = await handlePrompt(input.prompt);
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
            // choices: choices,
            post: post,
          };
        });
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

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { id: input.id },
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
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        include: {
          createdBy: true,
          likes: true,
          comments: true,
          pages: {
            orderBy: { number: "asc" },
          },
        },
        where: { published: input.published ?? undefined },
      });
    }),

  getAllById: publicProcedure
    .input(
      z.object({
        published: z.boolean().nullish(),
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        include: {
          createdBy: true,
          likes: true,
          comments: true,
          pages: {
            orderBy: { number: "asc" },
          },
        },
        where: {
          published: input.published ?? undefined,
          createdBy: {
            id: input.id,
          },
        },
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
        tags: z.string().min(2).nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: Number(input.id) },
        data: {
          name: input.name ?? undefined,
          description: input.description ?? undefined,
          published: input.published ?? undefined,
          tags: input.tags ?? undefined,
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

  setImage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        image: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const imageURL = await handleImagePrompt(input.image);
      return ctx.db.page.update({
        where: {
          id: input.id,
        },
        data: {
          image: imageURL,
        },
      });
    }),
});
