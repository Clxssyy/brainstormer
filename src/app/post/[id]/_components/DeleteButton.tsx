"use client";

import { inferRouterOutputs } from "@trpc/server";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const DeleteButton = ({
  post,
  session,
}: {
  post: Post;
  session: Session | null;
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
