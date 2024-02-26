import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import { getServerAuthSession } from "~/server/auth";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <header className="relative flex place-items-center border-b border-neutral-800 bg-neutral-900 p-2 text-white shadow-lg">
      <div className="w-1/3">
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
      <nav className="flex w-1/3 justify-center gap-4 font-semibold">
        <Link href="/create">Create</Link>
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
  );
};

export default Header;
