"use client";

import SidebarDropdown from "./SidebarDropdown";
import { api } from "~/trpc/react";
import Image from "next/image";
import Link from "next/link";
import { FaBrain, FaPlus } from "react-icons/fa";
import { Session } from "next-auth";
import { useState } from "react";
import { TbArrowBarRight } from "react-icons/tb";

const Sidebar = ({ session }: { session: Session | undefined }) => {
  const [hidden, setHidden] = useState(true);
  let user;
  if (session) {
    user = api.user.getById.useQuery({ id: session?.user.id }).data;
  }

  return (
    <nav
      className={`hidden-scroll hidden overflow-y-auto overflow-x-hidden bg-neutral-900 text-white transition-all duration-200 md:block ${hidden ? "w-14 min-w-14" : "w-1/3 lg:w-1/5"}`}
    >
      <header
        className={`mx-2 flex h-10 place-items-center ${hidden ? "justify-center" : "justify-between"}`}
      >
        {hidden ? null : (
          <h1 className="text-nowrap text-2xl font-bold">For You</h1>
        )}
        <button
          onClick={() => setHidden(!hidden)}
          className="rounded p-1 hover:bg-white/5"
        >
          {hidden ? (
            <TbArrowBarRight className="h-6 w-6 rotate-0 transition-all duration-200" />
          ) : (
            <TbArrowBarRight className="h-6 w-6 -rotate-180 transition-all duration-200" />
          )}
        </button>
      </header>
      <section className="flex flex-col gap-2">
        <SidebarDropdown title="Brainstorms" hidden={hidden}>
          {user?.posts.map((post) => {
            return (
              <Link
                key={post.id}
                href={`/post/${String(post.id)}`}
                className={`flex px-2 py-1 ${hidden ? "" : "hover:bg-white/5"}`}
              >
                <div className="flex w-full place-items-center justify-center gap-2">
                  <FaBrain
                    className={`h-6 min-w-6 ${post.published ? "text-pink-500" : "text-neutral-500"}`}
                  />
                  <p
                    className={`grow truncate text-sm font-semibold ${hidden ? "hidden" : ""}`}
                  >
                    {post?.name}
                  </p>
                </div>
              </Link>
            );
          })}
          <div className="mx-2">
            <Link
              href={session ? "/create" : "/api/auth/signin"}
              className="flex place-items-center justify-center rounded-full bg-white/[1%] px-2 py-1 hover:bg-white/5"
            >
              <FaPlus className="h-3 w-3 text-neutral-500" />
            </Link>
          </div>
        </SidebarDropdown>
        <SidebarDropdown title="Following" hidden={hidden}>
          {user?.following.map((follow) => {
            return (
              <Link
                key={follow.follows.id}
                href={`/user/${follow.follows.name}`}
                className={`flex px-2 py-1 ${hidden ? "" : "hover:bg-white/5"}`}
              >
                <div className="flex w-full place-items-center justify-center gap-2">
                  <Image
                    src={follow.follows.image ?? "/default-avatar.png"}
                    alt={follow.follows.name ?? "User"}
                    width={128}
                    height={128}
                    className="h-6 w-6 rounded-full"
                  />
                  <p
                    className={`grow truncate text-sm font-semibold ${hidden ? "hidden" : ""}`}
                  >
                    {follow?.follows.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </SidebarDropdown>
      </section>
    </nav>
  );
};

export default Sidebar;
