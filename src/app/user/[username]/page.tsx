import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import FollowButton from "../_components/FollowButton";
import BrainstormCard from "~/app/_components/BrainstormCard";

const userPage = async ({ params }: { params: { username: string } }) => {
  const session = await getServerAuthSession();
  const user = await api.user.getByName.query({ name: params.username });

  let published: boolean | undefined = undefined;

  if (!user) {
    return (
      <div className="error-bg flex grow place-items-center justify-center">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
          User not found!
        </h1>
      </div>
    );
  }

  if (session?.user?.name !== user.name) published = true;

  const posts = await api.post.getAllById.query({
    published: published,
    id: user.id,
    direction: "asc",
  });

  return (
    <div className="custom-scroll flex grow flex-col overflow-y-auto bg-neutral-950 text-white">
      <div className="flex flex-col gap-2 p-8">
        <div className="place-self-center rounded-full">
          <Image
            src={user.image ?? "/default-avatar.png"}
            alt={user.name ?? "User"}
            width={128}
            height={128}
            className="profile-border rounded-full"
          />
        </div>
        <h1 className="text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent">
          {user.name}
        </h1>
        <p className="text-center text-xs">
          Joined: {String(user.createdAt.toLocaleDateString())}
        </p>
        <div className="place-self-center rounded bg-neutral-900 p-2">
          <div className="flex gap-4">
            <p>Followers: {user.followers.length}</p>
            <p>Following: {user.following.length}</p>
          </div>
          <p className="text-center">Posts: {posts.items.length}</p>
        </div>
        {published ? <FollowButton user={user} session={session} /> : null}
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <div className="grid gap-4 md:grid-cols-2">
            {posts.items.map((post) => {
              return <BrainstormCard key={post.id} post={post} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default userPage;
