import { trpc } from "../../../utils/trpc";
import { useZodForm } from "../../../utils/zodForm";
import { createEventSchema } from "../formValidation";

const NewEvent = () => {
  const ctx = trpc.useContext();

  const mutation = trpc.useMutation(["events.create-event"], {
    onSuccess: async () => {
      ctx.invalidateQueries("events.events");
    },
  });

  const methods = useZodForm({
    schema: createEventSchema,
    defaultValues: {
      title: "",
      time: "",
      description: "",
      place: "",
    },
  });

  console.log(methods.watch());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto w-10/12 md:w-1/2">
      <h1>New event</h1>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          await mutation.mutate(values);
          methods.reset();
        })}
        className={`flex flex-col gap-2`}
      >
        <label className="flex flex-col">
          Title
          <input
            type="text"
            {...methods.register("title")}
            className="border"
          />
        </label>
        {methods.formState.errors.title?.message && (
          <p className="text-red-700">
            {methods.formState.errors.title?.message}
          </p>
        )}

        <label className="flex flex-col">
          Description
          <textarea {...methods.register("description")} className="border" />
        </label>
        {methods.formState.errors.description?.message && (
          <p className="text-red-700">
            {methods.formState.errors.description?.message}
          </p>
        )}

        <label className="flex flex-col">
          Time
          <input type="text" {...methods.register("time")} className="border" />
        </label>

        {methods.formState.errors.time?.message && (
          <p className="text-red-700">
            {methods.formState.errors.description?.message}
          </p>
        )}
        <label className="flex flex-col">
          Place
          <input
            type="text"
            {...methods.register("place")}
            className="border"
          />
        </label>

        {methods.formState.errors.place?.message && (
          <p className="text-red-700">
            {methods.formState.errors.description?.message}
          </p>
        )}

        <button className="btn" type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default NewEvent;
