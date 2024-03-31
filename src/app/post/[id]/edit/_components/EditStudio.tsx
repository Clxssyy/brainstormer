"use client";

import { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { FaLock, FaLockOpen } from "react-icons/fa6";
import { useState } from "react";
import Image from "next/image";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const EditStudio = ({ id, post }: { id: string; post: Post }) => {
  const router = useRouter();
  const postUpdater = api.post.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const pageUpdater = api.post.updatePage.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const [name, setName] = useState(post!.name);
  const [description, setDescription] = useState(post!.description || "");

  return (
    <div className="grow bg-neutral-950 p-8 text-white">
      <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-3xl font-bold text-transparent">
        Edit Studio
      </h1>
      <p>Post #{id}</p>
      <div className="flex gap-2">
        <button
          className="rounded-full bg-white/5 p-2"
          onClick={() => {
            postUpdater.mutate({
              id: id,
              published: !post!.published,
            });
          }}
        >
          {post!.published ? <FaLock /> : <FaLockOpen />}
        </button>
        <input
          type="text"
          value={name}
          className="rounded bg-neutral-800 p-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={description}
          className="rounded bg-neutral-800 p-2"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="rounded bg-neutral-800 p-2"
          onClick={() => {
            postUpdater.mutate({
              id: id,
              name,
              description,
            });
          }}
        >
          Update
        </button>
      </div>
      <p>Pages: {post!.pages.length}</p>
      {post!.pages.map((page, index) => {
        return (
          <div key={index} className="flex flex-col">
            <p>Page #{index + 1}</p>
            <div className="flex gap-2 place-items-center">
              <p>{page.content}</p>
              <button
                className="bg-neutral-800 rounded p-2"
                onClick={() => pageUpdater.mutate({
                  id: page.id,
                  image: "/default-avatar.jpg",
                })}
              > Generate Image</button>
            </div>
            {page.image ? <Image src={page.image} width={100} height={100} alt="image" /> : undefined}
          </div>
        );
      })}
    </div >
  );
};

export default EditStudio;
