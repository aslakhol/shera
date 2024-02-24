import NewPost from "./NewPost";
import PostList from "./PostList";

type PostsProps = {
  eventId: number;
};

const Posts = (props: PostsProps) => {
  const { eventId } = props;

  return (
    <>
      <div className="flex flex-col gap-2">
        <PostList eventId={eventId} />
        <div>
          <NewPost eventId={eventId} />
        </div>
      </div>
    </>
  );
};

export default Posts;
