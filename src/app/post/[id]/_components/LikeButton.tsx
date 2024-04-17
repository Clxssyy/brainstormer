"use client";

import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { api } from "~/trpc/react";

import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import type { Session } from "next-auth";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const LikeButton = ({
  post,
  session,
}: {
  post: Post;
  session: Session | null;
}) => {
  const router = useRouter();
  const likePost = api.post.like.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const unlikePost = api.post.unlike.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const liked = post!.likes.some((like) => like.userId === session?.user?.id);

  return (
    <div className="flex place-items-center gap-1">
      <button
        onClick={() => {
          if (liked) {
            unlikePost.mutate({ id: post!.id });
          } else {
            likePost.mutate({ id: post!.id });
          }
        }}
      >
        {liked ? <FaHeart /> : <FaRegHeart />}
      </button>
      <span>{post!.likes.length}</span>
    </div>
  );
};

export default LikeButton;
