import { api } from "~/trpc/server";
import BrainstormCard from "../_components/BrainstormCard";

export const dynamic = "force-dynamic";

const ExplorePage = async () => {
  const postQuery = await api.post.getAll.query({
    published: true,
  });

  if (!postQuery) {
    return null;
  }

  return (
    <div className="custom-scroll flex grow flex-col gap-4 overflow-y-auto bg-neutral-950 p-8 text-white">
      <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text pb-2 text-center text-6xl font-bold text-transparent">
        Explore
      </h1>
      <div className="grid gap-2 md:grid-cols-2">
        {postQuery.map((post) => (
          <BrainstormCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
