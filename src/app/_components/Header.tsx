import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { getServerAuthSession } from "~/server/auth";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <header className="flex h-14 place-items-center border-b border-neutral-800 bg-neutral-900 p-2 text-white">
      <div className="w-1/2 md:w-1/3">
        <div className="w-fit">
          <Link href="/">
            <h1 className="max-w-fit bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-center text-4xl font-bold text-transparent">
              Brainstormer
              <span className="absolute text-xs font-bold text-white">
                Beta
              </span>
            </h1>
          </Link>
        </div>
      </div>
      <nav className="hidden w-1/3 justify-center gap-4 font-semibold md:flex">
        {session ? <Link href="/create">Create</Link> : null}
        <Link href="/explore">Explore</Link>
        {session ? <Link href="/following">Following</Link> : null}
      </nav>
      <div className="flex w-1/2 justify-end md:w-1/3">
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
  );
};

export default Header;
