import { getServerAuthSession } from "~/server/auth";
import EditStudio from "./_components/EditStudio";
import { api } from "~/trpc/server";

const EditPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerAuthSession();

  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return (
      <div className="error-bg flex grow place-items-center justify-center bg-neutral-950 text-4xl font-bold text-neutral-400">
        <p>Invalid post id!</p>
      </div>
    );
  }

  const post = await api.post.getById.query({ id: id });

  if (!post) {
    return (
      <div className="error-bg flex grow place-items-center justify-center bg-neutral-950 text-4xl font-bold text-neutral-400">
        <p>Post not found!</p>
      </div>
    );
  }

  if (post?.createdById !== session?.user.id) {
    return (
      <div className="error-bg flex grow place-items-center justify-center bg-neutral-950 text-4xl font-bold text-neutral-400">
        <p>Unauthorized!</p>
      </div>
    );
  }

  return (
    <div className="flex grow overflow-hidden">
      <EditStudio id={params.id} post={post} />
    </div>
  );
};

export default EditPage;
