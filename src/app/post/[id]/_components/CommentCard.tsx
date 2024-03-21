import Image from "next/image";
import { api } from "~/trpc/server";

const CommentCard = async ({
  comment,
}: {
  comment: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    postId: number;
    userId: string;
  };
}) => {
  const user = await api.user.getById.query({ id: comment.userId });
  return (
    <div className="flex h-20 place-items-center gap-4 p-2 even:bg-white/10">
      <Image
        src={user!.image || "/default-avatar.jpg"}
        alt={user!.name || "User"}
        width={128}
        height={128}
        className="h-8 w-8 rounded-full ring-2 ring-amber-400"
      />
      <div className="flex flex-col">
        <p className="text-xs">{user!.name}</p>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
