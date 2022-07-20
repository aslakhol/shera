import Spinner from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { attendEventSchema } from "../formValidation";
import { useZodForm } from "@/utils/zodForm";
import TextInput from "@/components/TextInput";

type AttendProps = { eventId: number };

const Attend = (props: AttendProps) => {
  const { eventId } = props;
  const ctx = trpc.useContext();

  const attendMutation = trpc.useMutation("events.attend", {
    onSuccess: async () => {
      ctx.refetchQueries(["events.attendees", { eventId }]);
      document.getElementById("attend-modal")?.click();
    },
  });

  const methods = useZodForm({
    schema: attendEventSchema,
    defaultValues: {
      name: "",
      email: "",
    },
  });

  return (
    <>
      <label htmlFor="attend-modal" className="btn modal-button btn-outline">
        Attend?
      </label>

      <input type="checkbox" id="attend-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="attend-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Attendees:</h3>
          <div className="py-4">
            <form
              onSubmit={methods.handleSubmit(async (values) => {
                const result = await attendMutation.mutateAsync({
                  ...values,
                  eventId,
                });
                methods.reset();
              })}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Attend;
