import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import BrainstormCard from "../_components/BrainstormCard";

const FollowingPage = async () => {
  const session = await getServerAuthSession();
  const user = await api.user.getById.query({ id: session?.user.id ?? "" });

  return (
    <div className="custom-scroll flex grow flex-col place-items-center gap-4 overflow-x-hidden overflow-y-scroll bg-neutral-950 p-8">
      <h1 className="bg-gradient-to-b from-white to-neutral-500 bg-clip-text pb-2 text-6xl font-bold text-transparent">
        Following
      </h1>
      <div className="grid w-full gap-2 md:grid-cols-2">
        {user?.following.map((followed, index) =>
          followed.follows.posts.map((post) => (
            <BrainstormCard post={post} key={index} />
          )),
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
