import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export default async function Home() {
  noStore();

  return (
    <div className="flex w-full place-items-center justify-center bg-neutral-950 text-white">
      <div className="flex h-3/4 w-1/2 flex-col place-items-center justify-center gap-4">
        <div className="flex flex-col place-items-center gap-4">
          <div>
            <h1 className="text-wrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
                Brainstormer
              </span>
              !
            </h1>
            <p className="text-center">
              From random thoughts to complete stories, Brainstormer is the
              place to be!
            </p>
          </div>
          <Link
            href="/api/auth/signin"
            className="rounded bg-amber-400 p-2 font-semibold text-black"
          >
            Get Started
          </Link>
        </div>
        <div className="grid w-full grow grid-cols-7 grid-rows-8 gap-2">
          <div className="col-span-3 row-span-4 rounded bg-neutral-800 p-2">
            <div className="h-full bg-neutral-900">
              Transform your random thoughts into entire short stories!
            </div>
          </div>
          <div className="col-span-2 row-span-4 rounded bg-neutral-800 p-2">
            <div className="h-full bg-neutral-900">Alternative pathways</div>
          </div>
          <div className="col-span-2 row-span-4 rounded bg-neutral-800 p-2">
            <div className="h-full bg-neutral-900">Unique Images</div>
          </div>
          <div className="col-span-2 row-span-4 rounded bg-neutral-800 p-2">
            <div className="h-full bg-neutral-900">
              Provide and recieve feedback on Brainstorms.
            </div>
          </div>
          <div className="col-span-3 row-span-4 rounded bg-neutral-800 p-2">
            <div className="h-full bg-neutral-900">
              Share and edit your Brainstorms
            </div>
          </div>
          <div className="col-span-2 row-span-4 rounded bg-neutral-800 p-2">
            <div className="h-full bg-neutral-900">
              Follow user's to get notifications when they share a Brainstorm.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
