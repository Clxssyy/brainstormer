import Image from "next/image";
import Link from "next/link";

const BrainstormCard = ({ post }: { post: any }) => {
  return (
    <div className="rounded border border-neutral-900 transition-all hover:scale-105 hover:bg-white/5">
      <Link href={`/post/${post.id}`} className="flex grow gap-2 p-4">
        <Image
          alt={post.createdById}
          src="/default-avatar.jpg"
          width={128}
          height={128}
          className="aspect-square"
        />
        <div className="grow">
          <h2 className="text-2xl">{post.name}</h2>
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
        <p className="text-xs text-neutral-500">#{post.id}</p>
      </Link>
    </div>
  );
};

export default BrainstormCard;
