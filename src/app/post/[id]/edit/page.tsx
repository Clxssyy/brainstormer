"use client";

import { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

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
    <div className="grow bg-neutral-900 text-white">
      <h1 className="text-2xl">Edit Post #{params.id}</h1>
      <button
        onClick={() => {
          postUpdater.mutate({
            id: params.id,
            published: !postQuery.data?.published,
          });
        }}
      >
        {postQuery.data?.published ? "Private" : "Publish"}
      </button>
      <input
        type="text"
        value={postQuery.data?.description}
        className="text-black"
      />
      <input
        type="text"
        value={postQuery.data?.name}
        className="text-black"
      />
      <p>Pages: {postQuery.data?.pages.length}</p>
      {postQuery.data?.pages.map((page) => {
        return <p>{page.content}</p>
      })}
    </div>
  );
};

export default PostEditPage;
