import Spinner from "@/components/Spinner";
import { useZodForm } from "@/utils/zodForm";
import { Session } from "next-auth";
import Email from "./Email";
import { profileSchema, ProfileSchemaType } from "./formValidation";
import Name from "./Name";

type ProfileFormProps = { user: Session["user"] };

const ProfileForm = (props: ProfileFormProps) => {
  const { user } = props;

  const methods = useZodForm({
    schema: profileSchema,
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const handleSubmit = (values: ProfileSchemaType) => {
    console.log(values);
    // updateEventMutation.mutate(
    //   {
    //     ...values,
    //     dateTime: new Date(values.dateTime),
    //     eventId: event.eventId,
    //   },
    //   {
    //     onSuccess: (result) => {
    //       router.push(`/events/${result.event.eventId}`);
    //       successActions();
    //     },
    //   }
    // );
  };

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)}>
      <Name methods={methods} />
      <Email methods={methods} />
      <div className="py-2" />
      <button className="btn" type="submit">
        {true ? "Update" : <Spinner />}
      </button>
    </form>
  );
};

export default ProfileForm;
