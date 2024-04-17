"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

import type { Session } from "next-auth";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type User = RouterOutput["user"]["getByName"];

const FollowButton = ({
  user,
  session,
}: {
  user: User;
  session: Session | null;
}) => {
  const router = useRouter();
  const follow = api.user.follow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const unfollow = api.user.unfollow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  if (
    user!.followers.some(
      (u: { id: number; userId: string; followsId: string }) =>
        u.userId === session?.user.id,
    )
  ) {
    return (
      <button
        className="place-self-center rounded-full bg-amber-500 px-3 text-black hover:bg-amber-400"
        onClick={() => {
          unfollow.mutate({ id: user!.id });
        }}
      >
        Unfollow
      </button>
    );
  }

  return session ? (
    <button
      className="place-self-center rounded-full bg-amber-500 px-3 text-black hover:bg-amber-400"
      onClick={() => {
        follow.mutate({ id: user!.id });
      }}
    >
      Follow
    </button>
  ) : (
    <Link
      href="/api/auth/signin"
      className="place-self-center rounded-full bg-amber-500 px-3 text-black hover:bg-amber-400"
      onClick={() => {
        follow.mutate({ id: user!.id });
      }}
    >
      Follow
    </Link>
  );
};

export default FollowButton;
