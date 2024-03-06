import { unstable_noStore as noStore } from "next/cache";
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
    <div className="rounded-lg bg-neutral-900 p-4 shadow-lg">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
};

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  return (
    <div className="custom-scroll flex grow flex-col gap-4 overflow-y-auto overflow-x-hidden bg-neutral-950 p-8 text-neutral-200">
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
        <p className="text-center text-sm">
          From random thoughts to complete stories, Brainstormer is the place to
          be!
        </p>
      </div>
      <Link
        href={session ? "/create" : "/api/auth/signin"}
        className="w-fit place-self-center rounded-3xl bg-amber-400 px-4 py-2 font-semibold text-black transition duration-300 ease-in-out hover:bg-amber-500"
      >
        Get Started
      </Link>
      <div className="grid grow grid-cols-1 gap-8 md:grid-cols-2">
        <FeatureCard title="Transform your thoughts">
          Transform your random thoughts into entire short stories!
        </FeatureCard>
        <FeatureCard title="Alternative pathways">
          Discover alternative pathways.
        </FeatureCard>
        <FeatureCard title="Unique Images">
          Find unique images for inspiration.
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
  );
}
