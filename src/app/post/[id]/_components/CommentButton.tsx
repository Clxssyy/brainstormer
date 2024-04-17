"use client";

import { useRouter } from "next/navigation";
import { FaRegComment } from "react-icons/fa";
import { api } from "~/trpc/react";
import { useState } from "react";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const CommentButton = ({ post }: { post: Post }) => {
  const [comment, setComment] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(true);
  const router = useRouter();
  const commentSetter = api.post.comment.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div className="relative flex place-items-center gap-1">
      <button
        onClick={() => {
          if (hidden) {
            setHidden(false);
            return;
          }

          if (comment === "") {
            setHidden(true);
            return;
          }

          commentSetter.mutate({
            id: post!.id,
            content: comment,
          });
          setComment("");
          setHidden(true);
        }}
      >
        <FaRegComment />
      </button>
      <input
        onChange={(e) => setComment(e.target.value)}
        type="text"
        value={comment}
        className={`absolute top-6 text-black ${hidden ? "hidden" : ""}`}
      />
      <span>{post!.comments.length}</span>
    </div>
  );
};

export default CommentButton;
