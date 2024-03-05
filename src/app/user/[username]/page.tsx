import { api } from "~/trpc/server";

const userPage = async ({ params }: { params: { username: string } }) => {
  const user = await api.user.getByName.query({ name: params.username });

  if (!user) {
    return <div>User not found</div>;
  }

  return <div>{user.name}</div>;
};

export default userPage;
