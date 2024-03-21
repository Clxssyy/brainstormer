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
    <div>
      <h1>Edit Post {params.id}</h1>
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
    </div>
  );
};

export default PostEditPage;