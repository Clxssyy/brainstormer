"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const DeleteButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const deletePost = api.post.delete.useMutation();

  return (
    <button
      onClick={() => {
        deletePost.mutate({
          id,
        });

        router.push("/");
      }}
    >
      Delete
    </button>
  );
};

export default DeleteButton;
