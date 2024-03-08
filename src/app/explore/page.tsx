"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

const ExplorePage = () => {
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const postsQuery = api.post.getAll.useInfiniteQuery(
    {
      direction: direction ?? undefined,
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
    setPosts(posts);
    console.log(posts);
  }, [postsQuery.data?.pages, setPosts]);

  return (
    <div className="flex grow flex-col gap-2 bg-neutral-950 p-8 text-white">
      <h1 className="text-4xl font-bold">Explore</h1>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage || !hasNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
        <select
          name="direction"
          id="direction"
          defaultValue={"asc"}
          className="text-black"
          onChange={(e) => setDirection(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Ascending</option>
          <option value="asc">Descending</option>
        </select>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-2">
          {posts?.map((post) => (
            <div
              key={post?.id}
              className="flex flex-col border border-neutral-900 p-4"
            >
              <div className="flex justify-between">
                <h2 className="text-2xl">{post?.name}</h2>
                <p className="text-xs text-neutral-500">#{post?.id}</p>
              </div>
              <p>
                By:{" "}
                <Link
                  href={`/user/${post.createdBy.name}`}
                  className="text-amber-400"
                >
                  {post?.createdBy.name}
                </Link>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
