"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getById"];

const PageDisplay = ({ post }: { post: Post }) => {
  const [activePages, setActivePages] = useState(
    post!.pages.filter((page) => page.number < 3),
  );

  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    setActivePages(
      post!.pages.filter(
        (page) =>
          page.number < pageCount * 2 + 1 && page.number > pageCount * 2 - 2,
      ),
    );
  }, [pageCount]);

  return (
    <div className="flex grow">
      <button
        onClick={() => {
          setPageCount(pageCount - 1);
        }}
        className={`transition-colors hover:animate-pulse hover:bg-white/5 ${pageCount * 2 - 1 > 1 ? "" : "invisible"}`}
      >
        <FaChevronLeft className="h-6 w-6" />
      </button>
      <div className="flex grow divide-x-2 divide-neutral-900">
        {activePages.map((page) => (
          <div key={page.id} className="flex w-1/2 flex-col p-4">
            <div className="flex justify-center">
              {page.image ? (
                <Image
                  src={page.image}
                  width={1024}
                  height={1024}
                  alt="image"
                  className="aspect-square h-96 w-fit rounded"
                />
              ) : undefined}
            </div>
            <p>{page.content}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          setPageCount(pageCount + 1);
        }}
        className={`transition-colors hover:animate-pulse hover:bg-white/5 ${pageCount * 2 + 1 <= post!.pages.length ? "" : "invisible"}`}
      >
        <FaChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default PageDisplay;
