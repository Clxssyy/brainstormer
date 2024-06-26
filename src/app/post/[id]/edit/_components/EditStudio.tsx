"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { FaLock, FaLockOpen } from "react-icons/fa6";
import { useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { TbArrowBackUp } from "react-icons/tb";
import { TagSpan } from "~/app/_components/BrainstormCard";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

type Page = {
  id: number;
  content: string;
  image: string | null;
  number: number;
  createdAt: Date;
  updatedAt: Date;
  postId: number;
};

const ImageButton = ({ page }: { page: Page }) => {
  const router = useRouter();

  const generateImage = api.post.setImage.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className="max-w-[50%] grow rounded bg-neutral-800 p-2 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-900"
      onClick={() => {
        if (generateImage.isLoading) return;
        generateImage.mutate({
          id: page.id,
          image: page.content,
        });
      }}
      disabled={generateImage.isLoading}
    >
      {" "}
      {generateImage.isLoading ? "Generating..." : "Generate Image"}
    </button>
  );
};

const PageEdit = ({ page }: { page: Page }) => {
  const router = useRouter();
  const [pageContent, setPageContent] = useState<string>(page.content);
  const pageUpdater = api.post.updatePage.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col place-items-center">
        <p className="text-xl">Page {page.number}</p>
        {page.image ? (
          <Image
            src={page.image}
            width={1024}
            height={1024}
            alt="image"
            className="aspect-square w-96 rounded"
          />
        ) : undefined}
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          id={page.postId + "-" + page.number}
          value={pageContent}
          className="resize-none rounded bg-neutral-800 p-2"
          placeholder="Content"
          onChange={(e) => setPageContent(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="grow rounded bg-neutral-800 p-2 hover:bg-neutral-700"
            onClick={() =>
              pageUpdater.mutate({
                id: page.id,
                content: pageContent,
              })
            }
          >
            {pageUpdater.isLoading ? "Updating..." : "Update"}
          </button>
          {page.image ? undefined : <ImageButton page={page} />}
        </div>
      </div>
    </div>
  );
};

const EditStudio = ({ id, post }: { id: string; post: Post }) => {
  const router = useRouter();
  const postUpdater = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const [name, setName] = useState(post!.name);
  const [description, setDescription] = useState(post!.description ?? "");
  const [tags, setTags] = useState(
    post!.tags?.split(/(#\w+)/).filter((tag) => tag !== "") ?? [],
  );

  return (
    <div className="custom-scroll grow overflow-y-auto bg-neutral-950 p-8 text-white">
      <div className="relative flex justify-center">
        <button
          onClick={() => router.push(`/post/${id}`)}
          className="absolute left-0 top-0 rounded-full bg-white/5 p-3 hover:text-amber-400"
        >
          <TbArrowBackUp className="h-6 w-6" />
        </button>
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-3xl font-bold text-transparent">
          Edit Studio - #{id}
        </h1>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button
          className="rounded-full bg-white/5 p-4 hover:text-red-400"
          onClick={() => {
            deletePost.mutate({
              id: post!.id,
            });
          }}
        >
          <FaTrash />
        </button>
        <button
          className="rounded-full bg-white/5 p-4 hover:text-pink-500"
          onClick={() => {
            postUpdater.mutate({
              id: id,
              published: !post!.published,
            });
          }}
        >
          {post!.published ? <FaLock /> : <FaLockOpen />}
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <input
          type="text"
          value={name}
          className="rounded bg-neutral-800 p-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          value={description}
          className="resize-none rounded bg-neutral-800 p-2"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <div className="flex flex-col gap-1">
          <input
            onChange={(e) => {
              if (
                e.target.value.startsWith("#") &&
                e.target.value.length > 2 &&
                e.target.value.endsWith(" ")
              ) {
                e.target.value = e.target.value.trim();
                setTags([
                  ...tags,
                  ...e.target.value.split(/(#\w+)/).filter((tag) => tag !== ""),
                ]);
                e.target.value = "";
              }
            }}
            placeholder="#tagsGoHere"
            className="rounded bg-neutral-800 p-2"
          />
          <div className="flex gap-1">
            {tags.map((tag, index) => (
              <button
                className="flex rounded-full hover:bg-red-600"
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag));
                }}
                key={tag + "-" + index}
              >
                <TagSpan tag={tag} />
              </button>
            ))}
          </div>
        </div>
        <button
          className="rounded bg-neutral-800 p-2 hover:bg-neutral-700"
          onClick={() => {
            postUpdater.mutate({
              id: id,
              name,
              description,
              tags: tags.join(""),
            });
          }}
        >
          {postUpdater.isLoading ? "Updating..." : "Update"}
        </button>
      </div>
      <div className="mt-4">
        <p className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold text-transparent">
          Pages ({post!.pages.length})
        </p>
        <div className="flex flex-col gap-2 divide-y divide-amber-400">
          {post!.pages.map((page, index) => (
            <PageEdit page={page} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditStudio;
