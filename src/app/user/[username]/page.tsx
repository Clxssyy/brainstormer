import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const userPage = async ({ params }: { params: { username: string } }) => {
  const session = await getServerAuthSession();
  const user = await api.user.getByName.query({ name: params.username });

  let profile: boolean = false;

  if (!user) {
    return (
      <div className="error-bg flex grow place-items-center justify-center">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
          User not found!
        </h1>
      </div>
    );
  }

  if (session?.user?.name === user.name) profile = true;

  return (
    <div className="flex grow flex-col bg-neutral-950 text-white">
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
        <h1 className="text-center text-4xl font-bold">{user.name}</h1>
        <div className="place-self-center rounded bg-neutral-900 p-2">
          <div className="flex gap-4">
            <p>Followers: {user.followers.length}</p>
            <p>Following: {user.following.length}</p>
          </div>
          <p>Posts: {user.posts.length}</p>
          <p className="text-center text-xs">
            Joined: {String(user.createdAt.toLocaleDateString())}
          </p>
        </div>
        {profile ? <p>you</p> : null}
      </div>
    </div>
  );
};

export default userPage;
