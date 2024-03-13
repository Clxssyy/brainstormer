import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BrainstormCard = ({ post }: { post: any }) => {
  return (
    <div className="flex grow gap-2 rounded border border-neutral-800 bg-neutral-900 p-4">
      <div className="min-w-fit">
        <Link href={`/post/${post.id}`}>
          <Image
            alt={post.createdById}
            src="/default-avatar.jpg"
            width={128}
            height={128}
            className="aspect-square"
          />
        </Link>
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <div className="flex justify-between gap-2 overflow-hidden">
          <div className="flex place-items-center gap-2 overflow-hidden">
            {post.published ? (
              <FaEye className="min-h-4 min-w-4" />
            ) : (
              <FaEyeSlash className="min-h-4 min-w-4" />
            )}
            <Link
              href={`/post/${post.id}`}
              className="truncate text-lg hover:underline hover:decoration-amber-400"
            >
              {post.name}
            </Link>
          </div>
          <p className="text-xs text-neutral-500">#{post.id}</p>
        </div>
        <div className="flex place-items-center gap-4">
          <p>
            By:{" "}
            <Link
              href={`/user/${post.createdBy.name}`}
              className="text-amber-400 transition-colors hover:text-amber-600 hover:underline"
            >
              {post.createdBy.name}
            </Link>
          </p>
          <p className="text-xs text-neutral-500">
            {String(post?.createdAt.toLocaleDateString())}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrainstormCard;
