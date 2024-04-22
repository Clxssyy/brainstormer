import Image from "next/image";
import Link from "next/link";
import { FaComment, FaEyeSlash, FaHeart } from "react-icons/fa";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getAllById"][0];

const ProfileBrainstormCard = ({ post }: { post: Post }) => {
  const currentDate = new Date();
  const postDate = new Date(post.createdAt);

  const isHot = post.likes.length > 1;

  const isNew =
    currentDate.getTime() - postDate.getTime() < 1000 * 60 * 60 * 24;

  console.log(post.pages[0]?.image ?? "/default-avatar.jpg");
  console.log(post.pages[0]?.content);

  return (
    <Link
      href={`/post/${post.id}`}
      className="transition-all hover:scale-[101%]"
    >
      <div className="flex h-56 grow gap-2 rounded border border-neutral-800 bg-neutral-900 p-2">
        <div className="relative min-w-fit">
          {post.published ? null : (
            <div className="absolute flex h-full w-full place-items-center justify-center">
              <FaEyeSlash className="h-10 w-10 text-amber-400/50" />
            </div>
          )}
          <div className="relative">
            <Image
              alt={post.createdById}
              src={post.pages[0]?.image ?? "/default-avatar.jpg"}
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
              {post.description ?? "No description provided."}
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
