"use client";

import { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { FaLock, FaLockOpen } from "react-icons/fa6"

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const PostEditPage = ({ params }: { params: { id: string }; post: Post }) => {
  const router = useRouter();
  const postQuery = api.post.getById.useQuery({ id: params.id });
  const postUpdater = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
      postQuery.refetch();
    },
  });
  return (
    <div className="grow bg-neutral-950 text-white p-8">
      <h1 className="text-3xl text-transparent text-center font-bold to-neutral-400 from-white bg-gradient-to-b bg-clip-text">
        Edit Studio
      </h1>
      <p>Post #{params.id}</p>
      <div className="flex gap-2">
        <button
          className="p-2 bg-white/5 rounded-full"
          onClick={() => {
            postUpdater.mutate({
              id: params.id,
              published: !postQuery.data?.published,
            });
          }}
        >
          {postQuery.data?.published ? <FaLock /> : <FaLockOpen />}
        </button>
        <input type="text" value={postQuery.data?.name} className="bg-neutral-800 p-2 rounded" />
        <input
          type="text"
          value={postQuery.data?.description}
          className="bg-neutral-800 p-2 rounded"
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
        )
      })}
    </div>
  );
};

export default PostEditPage;
