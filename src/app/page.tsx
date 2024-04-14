import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const FeatureCard = ({
  title,
  children,
}: {
  title: string;
  children: string;
}) => {
  return (
    <div className="h-40 rounded bg-neutral-900 p-4 shadow">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{children}</p>
    </div>
  );
};

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="custom-scroll grow overflow-y-scroll bg-neutral-950 text-neutral-200">
      <div className="m-8 flex flex-col place-items-center gap-4">
        <div>
          <h1 className="text-center text-3xl font-bold text-transparent md:text-6xl">
            <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text">
              Welcome to{" "}
            </span>
            <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text">
              Brainstormer
            </span>
            <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text">
              !
            </span>
          </h1>
          <p className="text-center text-xs">
            From random thoughts to complete stories, Brainstormer is the place
            to be!
          </p>
        </div>
        <div className="flex sm:gap-8">
          <Link
            href={session ? "/create" : "/api/auth/signin"}
            className="w-36 place-self-center rounded-3xl bg-amber-400 px-4 py-2 text-center font-semibold text-black transition duration-300 ease-in-out hover:bg-amber-500"
          >
            Get Started
          </Link>
          <Link
            href="/explore"
            className="hidden w-36 place-self-center rounded-3xl px-4 py-2 text-center font-semibold text-white ring-1 ring-amber-400 transition duration-300 ease-in-out hover:bg-white/5 sm:block"
          >
            Examples
          </Link>
        </div>
        <div className="grid grow grid-cols-1 gap-8 md:grid-cols-2">
          <FeatureCard title="Transform your thoughts">
            Transform your random thoughts into entire short stories!
          </FeatureCard>
          <FeatureCard title="Alternative pathways">
            Choose how your story continues with alternative pathways.
          </FeatureCard>
          <FeatureCard title="Unique Images">
            Generate unique images for each page.
          </FeatureCard>
          <FeatureCard title="Provide & receive feedback">
            Provide and receive feedback on Brainstorms.
          </FeatureCard>
          <FeatureCard title="Share & edit Brainstorms">
            Share and edit your Brainstorms.
          </FeatureCard>
          <FeatureCard title="Follow users">
            Follow users to get notifications when they share a Brainstorm.
          </FeatureCard>
        </div>
      </div>
    </div>
  );
}
