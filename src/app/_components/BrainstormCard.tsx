import Image from "next/image";
import Link from "next/link";

const BrainstormCard = ({ post }: { post: any }) => {
  return (
    <div className="rounded border border-neutral-900">
      <div className="flex grow gap-2 p-4">
        <Link href={`/post/${post.id}`}>
          <Image
            alt={post.createdById}
            src="/default-avatar.jpg"
            width={128}
            height={128}
            className="aspect-square"
          />
        </Link>
        <div className="flex grow flex-col justify-between">
          <div>
            <Link
              href={`/post/${post.id}`}
              className="text-2xl hover:underline hover:decoration-amber-400"
            >
              {post.name}
            </Link>
            <p className="text-xs text-neutral-500">
              {String(post?.createdAt.toLocaleDateString())}
            </p>
          </div>
          <p>
            By:{" "}
            <Link
              href={`/user/${post.createdBy.name}`}
              className="text-amber-400 transition-colors hover:text-amber-600 hover:underline"
            >
              {post.createdBy.name}
            </Link>
          </p>
        </div>
        <p className="text-xs text-neutral-500">#{post.id}</p>
      </div>
    </div>
  );
};

export default BrainstormCard;
