import type { Posts, User } from "@prisma/client";

type PostProps = { post: Posts & { author: User } };

const Post = (props: PostProps) => {
  const { post } = props;

  return (
    <div key={post.postId} className="border p-4 rounded w-full">
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
      <p className="py-2">{post.message}</p>
    </div>
  );
};

export default Post;
