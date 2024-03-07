import { api } from "~/trpc/server";

const PostPage = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getById.query({
    id: params.id,
  });
  return (
    <div>
      <h1>{post?.name}</h1>
    </div>
  );
};

export default PostPage;
