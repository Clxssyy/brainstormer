"use client";

import { inferRouterOutputs } from "@trpc/server";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { FaRegComment } from "react-icons/fa";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const CommentButton = ({
  post,
  session,
}: {
  post: Post;
  session: Session | null;
}) => {
  const router = useRouter();
  const comment = api.post.comment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className="flex place-items-center gap-1">
      <button
        onClick={() =>
          comment.mutate({
            id: post!.id,
            content: "Hello, World!",
          })
        }
      >
        <FaRegComment />
      </button>
      <span>{post!.comments.length}</span>
    </div>
  );
};

export default CommentButton;
