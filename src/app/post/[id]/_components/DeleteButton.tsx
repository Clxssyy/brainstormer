"use client";

import { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const DeleteButton = ({
  post,
}: {
  post: Post;
}) => {
  const router = useRouter();
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  return (
    <button
      onClick={() => {
        deletePost.mutate({
          id: post!.id,
        });
      }}
    >
      <FaTrash />
    </button>
  );
};

export default DeleteButton;
