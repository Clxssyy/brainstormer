"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBrain, FaHeart, FaPlus } from "react-icons/fa";
import { TbArrowBarRight } from "react-icons/tb";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { useState } from "react";

type RouterOutput = inferRouterOutputs<AppRouter>;
type User = RouterOutput["user"]["getById"];

interface SidebarProps {
  user: User;
}

const Sidebar = ({ user }: SidebarProps) => {
  const [hidden, setHidden] = useState(false);

  return (
    <nav
      className={`custom-scroll flex flex-col gap-2 overflow-y-auto overflow-x-hidden bg-neutral-900 text-white transition-all ${hidden ? "min-w-16 place-items-center" : "min-w-64"}`}
    >
      <div className="mx-2 flex min-h-10 place-items-center justify-between">
        <h1
          className={`text-nowrap text-2xl font-bold ${hidden ? "hidden" : ""}`}
        >
          For You
        </h1>
        <button onClick={() => setHidden(!hidden)}>
          <TbArrowBarRight
            className={`h-6 w-6 transition-all ${hidden ? "rotate-0" : "rotate-180"}`}
          />
        </button>
      </div>
      <div className="flex grow flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="mx-2 h-6">
            {hidden ? (
              <FaBrain className="h-6 w-6" />
            ) : (
              <h2 className="text-xl font-semibold">Brainstorms</h2>
            )}
          </div>
          <div className="flex grow flex-col">
            {user?.posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className={`px-2 py-1 ${hidden ? "" : "hover:bg-white/5"}`}
              >
                <div className="flex gap-2">
                  <FaBrain
                    className={`min-h-6 min-w-6 ${post.published ? "text-pink-500" : "text-neutral-700"}`}
                  />
                  <h3 className={`truncate ${hidden ? "hidden" : ""}`}>
                    {post.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div>
            <Link
              href="/create"
              className="mx-2 flex justify-center rounded-full bg-white/10 p-1 text-neutral-500 transition-all hover:bg-white/20 hover:text-white"
            >
              <FaPlus className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="mx-2 h-6">
            {hidden ? (
              <FaHeart className="h-6 w-6" />
            ) : (
              <h2 className="text-xl font-semibold">Following</h2>
            )}
          </div>
          <div className="flex grow flex-col">
            {user?.following.map((follow) => (
              <Link
                key={follow.id}
                href={`/user/${follow.follows.name}`}
                className={`px-2 py-1 ${hidden ? "" : "hover:bg-white/5"}`}
              >
                <div className="flex gap-2">
                  <Image
                    src={follow.follows.image || "/default-avatar.jpg"}
                    alt={follow.follows.name || follow.followsId}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <h3 className={`truncate ${hidden ? "hidden" : ""}`}>
                    {follow.follows.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
