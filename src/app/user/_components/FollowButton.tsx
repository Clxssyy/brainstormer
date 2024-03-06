"use client";

import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const FollowButton = ({
  user,
  profile,
  session,
}: {
  user: any;
  profile: any;
  session: Session | undefined;
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

  if (!session) return null;

  if (profile) return null;

  if (user.followers.some((u: any) => u.userId === session.user.id)) {
    return (
      <button
        onClick={() => {
          unfollow.mutate({ id: user.id });
        }}
      >
        Unfollow
      </button>
    );
  } else {
    return (
      <button
        onClick={() => {
          follow.mutate({ id: user.id });
        }}
      >
        Follow
      </button>
    );
  }
};

export default FollowButton;
