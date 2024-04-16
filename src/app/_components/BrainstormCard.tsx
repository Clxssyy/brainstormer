import { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import { FaComment, FaHeart } from "react-icons/fa";
import { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getAll"]["items"][0];

export const TagSpan = ({ tag }: { tag: string }) => {
  const colorDict: { [key: number]: string } = {
    2: "green",
    3: "blue",
    4: "indigo",
    5: "purple",
    6: "pink",
    7: "red",
    8: "orange",
    9: "yellow",
  };

  const color = colorDict[tag.length];

  return (
    <span className={`${color} w-fit truncate rounded-full px-2 text-xs`}>
      {tag}
    </span>
  );
};

const BrainstormCard = ({ post }: { post: Post }) => {
  const currentDate = new Date();
  const postDate = new Date(post.createdAt);

  const isHot = post.likes.length > 1;

  const isNew =
    currentDate.getTime() - postDate.getTime() < 1000 * 60 * 60 * 24;

  let tags: string[];
  if (post.tags) {
    tags = post.tags.split(/(#\w+)/).filter((tag) => tag !== "");
  } else {
    tags = [];
  }

  return (
    <div className="flex h-56 grow gap-2 rounded border border-neutral-800 bg-neutral-900 p-2">
      <div className="relative flex w-32 flex-col gap-1">
        <Link href={`/post/${post.id}`} className="relative">
          <Image
            alt={post.createdById}
            src={post.pages[0]?.image || "/default-avatar.jpg"}
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
        </Link>
        <div className="hidden-scroll flex flex-wrap place-items-center justify-center gap-1 overflow-x-hidden overflow-y-scroll">
          {tags.map((tag) => (
            <TagSpan tag={tag} />
          ))}
        </div>
      </div>
      <div className="flex grow flex-col gap-2 overflow-hidden">
        <div>
          <div className="flex justify-between gap-2 overflow-hidden">
            <div className="flex place-items-center gap-2 overflow-hidden">
              <Link
                href={`/post/${post.id}`}
                className="truncate text-nowrap bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-lg font-bold text-transparent hover:underline hover:decoration-amber-400"
              >
                {post.name}
              </Link>
            </div>
            <p className="text-xs text-neutral-500">#{post.id}</p>
          </div>
          <div className="flex place-items-center gap-4 text-xs">
            <p className="text-white">
              By:{" "}
              <Link
                href={`/user/${post.createdBy.name}`}
                className="text-amber-400 transition-colors hover:text-amber-600 hover:underline"
              >
                {post.createdBy.name}
              </Link>
            </p>
          </div>
        </div>
        <div className="grow rounded bg-neutral-800 text-sm text-neutral-500">
          <p className="truncate p-1">
            {post.description || "No description provided."}
          </p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <div className="flex gap-2">
            <div className="flex place-items-center gap-1">
              <FaHeart className="text-neutral-500" />
              <p className="text-xs text-neutral-500">
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
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
  );
};

export default BrainstormCard;
