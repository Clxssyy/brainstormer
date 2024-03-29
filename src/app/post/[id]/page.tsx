import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import DeleteButton from "./_components/DeleteButton";
import LikeButton from "./_components/LikeButton";
import CommentButton from "./_components/CommentButton";
import CommentCard from "./_components/CommentCard";

const PostPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerAuthSession();

  const post = await api.post.getById.query({
    id: params.id,
  });

  const isUsersPost = post?.createdById === session?.user.id;

  if (!post) {
    return (
      <div className="error-bg flex grow place-items-center justify-center">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
          Post not found!
        </h1>
      </div>
    );
  }

  if (post.createdById !== session?.user?.id && !post.published) {
    return (
      <div className="error-bg flex grow place-items-center justify-center">
        <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-center text-6xl font-bold text-transparent">
          Post not found!
        </h1>
      </div>
    );
  }

  return (
    <div className="custom-scroll flex grow flex-col overflow-y-scroll bg-neutral-950 text-white">
      <div className="grow p-8">
        <div className="flex h-full grow flex-col rounded border border-neutral-900">
          <div className="flex gap-4 bg-neutral-900 p-4">
            <Image
              priority
              src={post.createdBy.image ?? "/default-avatar.png"}
              alt={post.createdBy.name ?? "User"}
              width={128}
              height={128}
              className="h-14 w-14 rounded-full ring-2 ring-amber-400"
            />
            <div className="flex grow flex-col">
              <div className="flex place-items-center justify-between">
                <h1 className="text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold text-transparent">
                  {post?.name}
                </h1>
                <p className="text-xs text-neutral-500">#{post.id}</p>
              </div>
              <div className="flex place-items-center justify-between">
                <Link
                  href={`/user/${post.createdBy.name}`}
                  className="text-sm text-amber-400"
                >
                  {post.createdBy.name}
                </Link>
              </div>
            </div>
          </div>
          <div className="flex grow divide-x-2 divide-neutral-900">
            {post.pages.map((page) => (
              <div key={page.id} className="p-4">
                <p>{page.content}</p>
              </div>
            ))}
          </div>
          <div className="flex place-items-center justify-between bg-neutral-800 p-2">
            <div className="flex gap-2">
              <LikeButton post={post} session={session} />
              <CommentButton post={post} session={session} />
              {isUsersPost && <DeleteButton post={post} session={session} />}
            </div>
            <p className="text-xs text-neutral-500">
              {String(post?.createdAt.toLocaleDateString())}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-2xl font-bold text-transparent">
            Comments
          </h2>
          <div>
            {post.comments.length === 0
              ? "Be the first to comment!"
              : post.comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
