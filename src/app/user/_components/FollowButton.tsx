"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const FollowButton = ({
  user,
  session,
}: {
  user: any;
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

  if (user.followers.some((u: any) => u.userId === session?.user.id)) {
    return (
      <button
        className="place-self-center rounded-full bg-amber-500 px-3 text-black hover:bg-amber-400"
        onClick={() => {
          unfollow.mutate({ id: user.id });
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
        follow.mutate({ id: user.id });
      }}
    >
      Follow
    </button>
  ) : (
    <Link
      href="/api/auth/signin"
      className="place-self-center rounded-full bg-amber-500 px-3 text-black hover:bg-amber-400"
      onClick={() => {
        follow.mutate({ id: user.id });
      }}
    >
      Follow
    </Link>
  );
};

export default FollowButton;
