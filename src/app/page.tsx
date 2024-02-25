import { unstable_noStore as noStore } from "next/cache";

import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import SidebarDropdown from "./_components/SidebarDropdown";
import ProfileDropdown from "./_components/ProfileDropdown";
import { TbArrowBarLeft } from "react-icons/tb";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-black">
      <header className="relative flex place-items-center border-b border-neutral-800 bg-neutral-900 p-2 text-white shadow-lg">
        <div className="w-1/3">
          <h1 className="max-w-fit bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-center text-4xl font-bold text-transparent">
            Brainstormer
            <span className="absolute text-xs font-bold text-white">Beta</span>
          </h1>
        </div>
        <nav className="flex w-1/3 justify-center gap-4 font-semibold">
          <Link href="">Create</Link>
          <Link href="">Explore</Link>
        </nav>
        <div className="flex w-1/3 justify-end">
          {session ? (
            <ProfileDropdown session={session} />
          ) : (
            <Link
              href="/api/auth/signin"
              className="duration place-self-center rounded-md bg-amber-400 px-4 py-1 font-semibold text-neutral-900 shadow-md transition hover:bg-amber-500 hover:shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </header>
      <section className="flex grow overflow-hidden">
        <nav className="w-1/6 overflow-y-auto bg-neutral-900 text-white">
          <div className="flex place-items-center justify-between p-2 ">
            <h2 className="text-2xl font-semibold">For You</h2>
            <TbArrowBarLeft className="h-6 w-6" />
          </div>
          <SidebarDropdown title="My Brainstorms">
            <Link href="" className="p-2 text-sm">
              Brainstorm 1
            </Link>
            <Link href="" className="p-2 text-sm">
              Brainstorm 2
            </Link>
          </SidebarDropdown>
          <SidebarDropdown title="Following"></SidebarDropdown>
        </nav>
        <div className="flex w-5/6 flex-col gap-2 overflow-hidden bg-neutral-950 p-12">
          <div className="grow overflow-y-auto rounded bg-neutral-900"></div>
          <div className="flex place-self-center rounded-lg">
            <input
              type="text"
              placeholder="What's on your mind?"
              className="w-3/4 rounded-bl-lg rounded-tl-lg bg-neutral-900 px-4 py-2 text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
            />
            <button className="rounded-br-lg rounded-tr-lg bg-amber-400 px-4 py-2 font-semibold text-neutral-900 shadow-md transition hover:bg-amber-500">
              Create
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
