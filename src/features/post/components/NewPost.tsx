import { usePerformPost } from "../hooks/usePerformPost";

type NewPostProps = { eventId: string };

const NewPost = (props: NewPostProps) => {
  const { eventId } = props;

  const postMutation = usePerformPost();

  const handlePost = () => {
    postMutation.mutate({
      title: "test",
      content: "test",
      authorEmail: "aslakhol@gmail.com",
      authorName: "Aslak Hollund",
      eventId: eventId,
    });
  };

  return (
    <>
      <button className="btn" onClick={handlePost}>
        Post
      </button>
    </>
  );
};

export default NewPost;
