import { getServerAuthSession } from "~/server/auth";
import EditStudio from "./_components/EditStudio";
import { api } from "~/trpc/server";

const EditPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerAuthSession();
  const post = await api.post.getById.query({ id: params.id });

  if (!post) {
    return <div>Post not found</div>;
  }

  if (post?.createdById !== session?.user.id) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex grow">
      <EditStudio id={params.id} />
    </div>
  );
};

export default EditPage;
