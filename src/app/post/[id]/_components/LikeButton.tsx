"use client";

import { inferRouterOutputs, router } from "@trpc/server";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

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
