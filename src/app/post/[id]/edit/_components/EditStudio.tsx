"use client";

import { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { FaLock, FaLockOpen } from "react-icons/fa6";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const EditStudio = ({ id, post }: { id: string, post: Post }) => {
  const router = useRouter();
  const postUpdater = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <div className="grow bg-neutral-950 p-8 text-white">
      <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-3xl font-bold text-transparent">
        Edit Studio
      </h1>
      <p>Post #{id}</p>
      <div className="flex gap-2">
        <button
          className="rounded-full bg-white/5 p-2"
          onClick={() => {
            postUpdater.mutate({
              id: id,
              published: !post.published,
            });
          }}
        >
          {post.published ? <FaLock /> : <FaLockOpen />}
        </button>
        <input
          type="text"
          value={post.name}
          className="rounded bg-neutral-800 p-2"
        />
        <input
          type="text"
          value={post.description}
          className="rounded bg-neutral-800 p-2"
          placeholder="Description"
        />
      </div>
      <p>Pages: {post.pages.length}</p>
      {post.pages.map((page, index) => {
        return (
          <div key={index} className="flex flex-col">
            <p>Page #{index + 1}</p>
            <p>{page.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EditStudio;
