import Image from "next/image";
import Link from "next/link";
import { FaComment, FaEyeSlash, FaHeart } from "react-icons/fa";

const ProfileBrainstormCard = ({ post }: { post: any }) => {
  const currentDate = new Date();
  const postDate = new Date(post.createdAt);

  const isHot = post.likes.length > 1;

  const isNew =
    currentDate.getTime() - postDate.getTime() < 1000 * 60 * 60 * 24;

  return (
    <Link
      href={`/post/${post.id}`}
      className="transition-all hover:scale-[101%]"
    >
      <div className="flex grow gap-2 rounded border border-neutral-800 bg-neutral-900 p-2">
        <div className="relative relative min-w-fit">
          {post.published ? null : (
            <div className="absolute flex h-full w-full place-items-center justify-center">
              <FaEyeSlash className="h-10 w-10 text-amber-400/50" />
            </div>
          )}
          <Image
            alt={post.createdById}
            src="/default-avatar.jpg"
            width={128}
            height={128}
            className="aspect-square rounded"
          />
          {isHot ? (
            <p className="absolute bottom-0 left-0 rotate-12 font-bold text-amber-400">
              🔥
            </p>
          ) : isNew ? (
            <p className="absolute bottom-0 left-0 rotate-12 font-bold text-amber-400">
              New!
            </p>
          ) : undefined}
        </div>
        <div className="flex grow flex-col gap-2 overflow-hidden">
          <div>
            <div className="flex justify-between gap-2 overflow-hidden">
              <div className="flex place-items-center gap-2 overflow-hidden">
                <p className="truncate text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-lg font-bold text-transparent">
                  {post.name}
                </p>
              </div>
              <p className="text-xs text-neutral-500">#{post.id}</p>
            </div>
          </div>
          <div className="grow rounded bg-neutral-800 p-1 text-sm text-neutral-500">
            <p className="truncate">
              {post.description || "No description provided."}
            </p>
          </div>
          <div className="flex place-items-center justify-between gap-2">
            <div className="flex gap-2">
              <div className="flex place-items-center gap-1">
                <FaHeart className="text-neutral-500" />
                <p className="text-xs text-neutral-500">
                  {post.likes.length}{" "}
                  {post.likes.length === 1 ? "like" : "likes"}
                </p>
              </div>
              <div className="flex place-items-center gap-1">
                <FaComment className="text-neutral-500" />
                <p className="text-xs text-neutral-500">
                  {post.comments.length}{" "}
                  {post.comments.length === 1 ? "comment" : "comments"}
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-500">
              {String(post?.createdAt.toLocaleDateString())}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileBrainstormCard;
