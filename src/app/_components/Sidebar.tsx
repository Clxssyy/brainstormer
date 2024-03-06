import SidebarDropdown from "./SidebarDropdown";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import Link from "next/link";

const Sidebar = async () => {
  const session = await getServerAuthSession();

  let following;

  if (session) {
    const user = await api.user.getById.query({
      id: session?.user.id,
    });

    const followingIds = await user?.following.map(
      (follow) => follow.followsId,
    );

    following = await api.user.getFollows.query({
      ids: followingIds ?? [],
    });
  }

  return (
    <nav
      className={`custom-scroll hidden w-1/6 min-w-fit place-items-center overflow-x-hidden overflow-y-scroll  text-nowrap bg-neutral-900 text-white shadow-lg md:flex md:flex-col`}
    >
      <h1 className="place-self-start px-2 text-2xl font-bold">For You</h1>
      <SidebarDropdown title="Brainstorms"></SidebarDropdown>
      <SidebarDropdown title="Following">
        {following?.map((follow) => {
          return (
            <Link
              key={follow.id}
              href={`/user/${follow.name}`}
              className="flex place-items-center gap-2 px-2 py-1 hover:bg-white/5"
            >
              <Image
                src={follow.image ?? "/default-avatar.png"}
                alt={follow.name ?? "User"}
                width={32}
                height={32}
                className="rounded-full"
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
