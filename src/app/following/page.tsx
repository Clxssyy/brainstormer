import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import BrainstormCard from "../_components/BrainstormCard";

const FollowingPage = async () => {
  const session = await getServerAuthSession();
  const user = await api.user.getById.query({ id: session.user.id });

  return (
    <div className="flex grow flex-col place-items-center gap-4 bg-neutral-950 w-full p-8">
      <h1 className="bg-gradient-to-b from-white to-neutral-500 text-transparent bg-clip-text text-6xl font-bold p-2">Following</h1>
      <div className="grid gap-2 md:grid-cols-2 w-full">
        {user?.following.map((followed) => followed.follows.posts.map((post) => <BrainstormCard post={post} />))}
      </div>
    </div>
  );
};

export default FollowingPage;
