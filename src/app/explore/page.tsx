"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import BrainstormCard from "../_components/BrainstormCard";

const ExplorePage = () => {
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const postsQuery = api.post.getAll.useInfiniteQuery(
    {
      published: true,
      direction: direction,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = postsQuery;

  const [posts, setPosts] = useState<
    ({
      createdBy: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        createdAt: Date;
      };
    } & {
      id: number;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      createdById: string;
    })[]
  >();

  useEffect(() => {
    const posts = postsQuery.data?.pages.map((page) => page.items).flat();
    setPosts(() => {
      return [...(posts ?? [])].sort((a, b) => {
        if (direction === "asc") {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    });
  }, [postsQuery.data?.pages, setPosts, direction]);

  return (
    <div className="custom-scroll flex grow flex-col gap-2 overflow-y-auto bg-neutral-950 p-8 text-white">
      <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
        Explore
      </h1>
      <div className="flex justify-center">
        <select
          name="direction"
          id="direction"
          defaultValue={"desc"}
          className="rounded border border-neutral-700 bg-neutral-900 p-2 text-white transition-colors hover:border-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50"
          onChange={(e) => setDirection(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {posts?.map((post) => <BrainstormCard post={post} key={post.id} />)}
      </div>
      <button
        onClick={() => fetchNextPage()}
        disabled={isFetchingNextPage || !hasNextPage}
        className="text-amber-400 transition-colors enabled:hover:text-amber-500 enabled:hover:underline disabled:cursor-not-allowed disabled:font-bold disabled:opacity-50"
      >
        {isFetchingNextPage
          ? "Loading..."
          : hasNextPage
            ? "Load More"
            : `Nothing more to load!`}
      </button>
    </div>
  );
};

export default ExplorePage;
