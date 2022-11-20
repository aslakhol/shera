import Spinner from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { useZodForm } from "@/utils/zodForm";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import Email from "./Email";
import { profileSchema, ProfileSchemaType } from "./formValidation";
import Name from "./Name";
import ProfilePicture from "./ProfilePicture";

type ProfileFormProps = { user: Session["user"] };

const ProfileForm = (props: ProfileFormProps) => {
  const { user } = props;
  const router = useRouter();

  const mutation = trpc.useMutation(["users.update-profile"], {});

  const methods = useZodForm({
    schema: profileSchema,
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
    },
  });

  const handleSubmit = (values: ProfileSchemaType) => {
    mutation.mutate(
      { userId: user.id!, ...values },
      {
        onError: () => {
          router.reload();
        },
      }
    );
  };

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)}>
      <Name methods={methods} />
      <Email methods={methods} />
      <ProfilePicture methods={methods} />
      <div className="py-2" />
      <button className="btn" type="submit">
        {!mutation.isLoading ? "Update" : <Spinner />}
      </button>
    </form>
  );
};

export default ProfileForm;
