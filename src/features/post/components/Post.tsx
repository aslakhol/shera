import ConfirmDelete from "@/components/ConfirmDelete";
import { trpc } from "@/utils/trpc";
import type { Events, Posts, User } from "@prisma/client";
import { useSession } from "next-auth/react";

type PostProps = { post: Posts & { author: User; events: Events } };

const Post = (props: PostProps) => {
  const { post } = props;
  const { data: session } = useSession();
  const ctx = trpc.useContext();
  const deletePostMutation = trpc.useMutation("posts.deletePost");

  const deletePost = () => {
    deletePostMutation.mutate(
      { postId: post.postId },
      {
        onSuccess: () => {
          ctx.invalidateQueries([
            "posts.posts",
            { eventId: post.eventsId.toString() },
          ]);
        },
      }
    );
  };

  const canDeletePost =
    session?.user.id === post.authorId ||
    session?.user.id === post.events.hostId;

  return (
    <div key={post.postId} className="border p-4 rounded w-full">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <span className="font-bold">
            {post.author.name || post.author.email || "Anonymous"}
          </span>
          <span className="italic text-sm">
            {post.createdAt.toLocaleString("en-GB", {
              month: "short",
              day: "numeric",
              minute: "numeric",
              hour: "numeric",
            })}
          </span>
        </div>
        {canDeletePost && (
          <ConfirmDelete
            whatToDelete="post"
            modalId={"post"}
            deleteAction={deletePost}
          />
        )}
      </div>

      <p className="py-2">{post.message}</p>
    </div>
  );
};

export default Post;
