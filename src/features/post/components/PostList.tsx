import { trpc } from "../../../utils/trpc";
import Post from "./Post";

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
        <Post key={post.postId} post={post} />
      ))}
    </>
  );
};

export default PostList;
