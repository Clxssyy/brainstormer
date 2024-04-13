import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import BrainstormCard from "../_components/BrainstormCard";

const FollowingPage = async () => {
  const session = await getServerAuthSession();
  const user = await api.user.getById.query({ id: session?.user.id || "" });

  return (
    <div className="flex w-full grow flex-col place-items-center gap-4 bg-neutral-950 p-8">
      <h1 className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text p-2 text-6xl font-bold text-transparent">
        Following
      </h1>
      <div className="grid w-full gap-2 md:grid-cols-2">
        {user?.following.map((followed) =>
          followed.follows.posts.map((post) => <BrainstormCard post={post} />),
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
