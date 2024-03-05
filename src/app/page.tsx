import { unstable_noStore as noStore } from "next/cache";

const FeatureCard = ({
  title,
  children,
}: {
  title: string;
  children: string;
}) => {
  return (
    <div className="rounded-lg bg-neutral-800 p-4 shadow-lg">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
};

export default async function Home() {
  noStore();

  return (
    <div className="grow overflow-hidden bg-neutral-950 text-white">
      <div className="custom-scroll flex h-full flex-col place-items-center gap-2 overflow-y-auto overflow-x-hidden p-8">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text">
            Brainstormer
          </span>
          !
        </h1>
        <p className="text-center">
          From random thoughts to complete stories, Brainstormer is the place to
          be!
        </p>
        <a
          href="/api/auth/signin"
          className="rounded bg-amber-400 p-3 font-semibold text-black transition duration-300 ease-in-out hover:bg-amber-500"
        >
          Get Started
        </a>
        <div className="grid grow grid-cols-1 gap-8 md:grid-cols-3">
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
    </div>
  );
}
