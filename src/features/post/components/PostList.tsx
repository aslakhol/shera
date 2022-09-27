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
          <span>
            {post.authorName} - {post.authorEmail}
          </span>
          <p>{post.content}</p>
        </div>
      ))}
    </>
  );
};

export default PostList;
