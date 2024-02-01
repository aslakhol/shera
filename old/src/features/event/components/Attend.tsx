import Spinner from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { attendEventSchema, AttendEventSchemaType } from "../formValidation";
import { useZodForm } from "@/utils/zodForm";
import TextInput from "@/components/TextInput";
import Modal from "@/components/Modal";

type AttendProps = { eventId: number };

const Attend = (props: AttendProps) => {
  const { eventId } = props;
  const ctx = trpc.useContext();

  const attendMutation = trpc.useMutation("events.attend", {});

  const methods = useZodForm({
    schema: attendEventSchema,
  });

  const handleSubmit = (values: AttendEventSchemaType) => {
    attendMutation.mutate(
      {
        ...values,
        eventId,
      },
      {
        onSuccess: () => {
          methods.reset();
          ctx.refetchQueries(["events.attendees", { eventId }]);
          document.getElementById("attend-modal")?.click();
        },
      }
    );
  };

  return (
    <Modal modalId="attend-modal" buttonText="Attend?" title="Attendees:">
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className={`form-control w-full max-w-xs gap-2`}
      >
        <TextInput
          name="name"
          label="Name"
          required
          registerReturn={methods.register("name")}
          fieldError={methods.formState.errors.name}
        />
        <TextInput
          name="email"
          label="Email"
          registerReturn={methods.register("email")}
          fieldError={methods.formState.errors.email}
        />

        <div className="py-2" />

        <button className="btn" type="submit">
          {!attendMutation.isLoading ? "Create" : <Spinner />}
        </button>
      </form>
    </Modal>
  );
};

export default Attend;