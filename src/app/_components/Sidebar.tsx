import SidebarDropdown from "./SidebarDropdown";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import Link from "next/link";
import { FaBrain } from "react-icons/fa";

const Sidebar = async () => {
  const session = await getServerAuthSession();

  let following;
  let user;

  if (session) {
    user = await api.user.getById.query({
      id: session?.user.id,
    });

    const followingIds = await user?.following.map(
      (follow) => follow.followsId,
    );

    following = await api.user.getFollows.query({
      ids: followingIds ?? [],
    });
  }

  const bool = true;

  return (
    <nav
      className={`custom-scroll hidden w-1/6 min-w-fit place-items-center overflow-x-hidden overflow-y-scroll  text-nowrap bg-neutral-900 text-white shadow-lg md:flex md:flex-col`}
    >
      <h1 className="place-self-start px-2 text-2xl font-bold">For You</h1>
      <SidebarDropdown title="Brainstorms">
        {user?.posts.map((post) => {
          return (
            <Link
              key={post.id}
              href={`/post/${post.id}`}
              className="flex h-10 place-items-center gap-2 px-2 py-1 hover:bg-white/5"
            >
              <FaBrain className={`h-8 w-8 ${bool ? "text-pink-500" : ""}`} />
              <p className="text-sm font-semibold">{post?.name}</p>
            </Link>
          );
        })}
      </SidebarDropdown>
      <SidebarDropdown title="Following">
        {following?.map((follow) => {
          return (
            <Link
              key={follow.id}
              href={`/user/${follow.name}`}
              className="flex h-10 place-items-center gap-2 px-2 py-1 hover:bg-white/5"
            >
              <Image
                src={follow.image ?? "/default-avatar.png"}
                alt={follow.name ?? "User"}
                width={128}
                height={128}
                className="h-8 w-8 rounded-full"
              />
              <p className="text-sm font-semibold">{follow?.name}</p>
            </Link>
          );
        })}
      </SidebarDropdown>
    </nav>
  );
};

export default Sidebar;
