import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import TextInput from "@/components/TextInput";
import { useZodForm } from "@/utils/zodForm";
import { useSession } from "next-auth/react";
import { PostSchemaType, postSchema } from "../formValidation";
import { usePerformPost } from "../hooks/usePerformPost";

type NewPostProps = { eventId: string };

const NewPost = (props: NewPostProps) => {
  const { eventId } = props;

  const { data: session } = useSession();
  const postMutation = usePerformPost();

  const methods = useZodForm({
    schema: postSchema,
  });

  const handleSubmit = (values: PostSchemaType) => {
    if (!session?.user?.id) {
      return;
    }

    postMutation.mutate(
      {
        ...values,
        authorId: session.user.id,
        eventId: eventId,
      },
      {
        onSuccess: () => {
          methods.reset();
          document.getElementById("post-modal")?.click();
        },
      }
    );
  };

  return (
    <Modal modalId="post-modal" buttonText={"Add a Post"} title={"Add a Post"}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className={`form-control w-full max-w-xs gap-2`}
      >
        <TextInput
          name="message"
          label="Message"
          registerReturn={methods.register("message")}
          fieldError={methods.formState.errors.message}
        />

        <div className="py-2" />

        <button className="btn" type="submit">
          {!postMutation.isLoading ? "Create" : <Spinner />}
        </button>
      </form>
    </Modal>
  );
};

export default NewPost;
