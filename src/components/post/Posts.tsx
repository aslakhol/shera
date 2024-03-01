import NewPost from "./NewPost";
import PostList from "./PostList";

type PostsProps = {
  publicId: string;
};

const Posts = (props: PostsProps) => {
  const { publicId } = props;

  return (
    <>
      <div className="flex flex-col gap-2">
        <PostList publicId={publicId} />
        <div>
          <NewPost publicId={publicId} />
        </div>
      </div>
    </>
  );
};

export default Posts;
