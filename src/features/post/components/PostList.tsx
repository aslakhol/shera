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
        <div key={post.postId}>
          <span>{post.author.name || post.author.email || "Anonymous"}</span>
          <p>{post.message}</p>
        </div>
      ))}
    </>
  );
};

export default PostList;
