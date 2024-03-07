import { api } from "~/trpc/server";

const PostPage = async ({ params }: { params: { id: string } }) => {
  const post = await api.post.getById.query({
    id: params.id,
  });
  return (
    <div className="flex grow flex-col bg-neutral-950 text-white">
      <div className="flex flex-col gap-2 p-8">
        <h1 className="text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent">
          {post?.name}
        </h1>
        <p className="text-center text-xs">
          Created: {String(post?.createdAt.toLocaleDateString())}
        </p>
        <div>
          <h1 className="text-2xl font-bold">Content</h1>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
