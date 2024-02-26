import { unstable_noStore as noStore } from "next/cache";

import Sidebar from "./_components/Sidebar";
import Link from "next/link";

export default async function Home() {
  noStore();

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-black">
      <section className="flex grow overflow-hidden">
        <Sidebar />
        <div className="flex w-full flex-col place-items-center justify-center gap-2 overflow-hidden bg-neutral-950 p-12 text-white">
          <div className="flex w-1/2 flex-col place-items-center">
            <h1 className="text-center text-4xl font-bold">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
                Brainstormer
              </span>
            </h1>
            <p className="text-center">
              Turn your random ideas into a reality with Brainstormer. Create
              brainstorms, share them with the world, and get feedback from the
              community.
            </p>
            <Link
              href="/create"
              className="rounded bg-amber-400 p-2 text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
