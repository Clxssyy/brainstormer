"use client";

import { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { FaLock, FaLockOpen } from "react-icons/fa6";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const EditStudio = ({ id }: { id: string }) => {
  const router = useRouter();
  const postQuery = api.post.getById.useQuery({ id: id });
  const postUpdater = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
      postQuery.refetch();
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
              published: !postQuery.data?.published,
            });
          }}
        >
          {postQuery.data?.published ? <FaLock /> : <FaLockOpen />}
        </button>
        <input
          type="text"
          value={postQuery.data?.name}
          className="rounded bg-neutral-800 p-2"
        />
        <input
          type="text"
          value={postQuery.data?.description}
          className="rounded bg-neutral-800 p-2"
          placeholder="Description"
        />
      </div>
      <p>Pages: {postQuery.data?.pages.length}</p>
      {postQuery.data?.pages.map((page, index) => {
        return (
          <div className="flex flex-col">
            <p>Page #{index + 1}</p>
            <p>{page.content}</p>
          </div>
        );
      })}
    </div>
  );
};

export default EditStudio;
