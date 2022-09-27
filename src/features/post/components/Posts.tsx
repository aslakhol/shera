import NewPost from "./NewPost";
import PostList from "./PostList";

type PostsProps = {
  eventId: string;
};

const Posts = (props: PostsProps) => {
  const { eventId } = props;

  return (
    <>
      <NewPost eventId={eventId} />
      <PostList eventId={eventId} />
    </>
  );
};

export default Posts;
