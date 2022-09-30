import { trpc } from "../../../utils/trpc";

type PostListProps = { eventId: string };

const PostList = (props: PostListProps) => {
  const { eventId } = props;

  const { data: posts, isSuccess } = trpc.useQuery([
    "posts.posts",
    { eventId },
  ]);

  if (!isSuccess) {
    return <></>;
  }

  return (
    <>
      {posts.map((post) => (
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
      ))}
    </>
  );
};

export default PostList;
