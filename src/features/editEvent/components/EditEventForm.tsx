import Spinner from "@/components/Spinner";
import Textarea from "@/components/Textarea";
import TextInput from "@/components/TextInput";
import Title from "@/features/newEvent/components/Title";
import {
  createEventSchema,
  CreateEventSchemaType,
} from "@/features/newEvent/formValidation";
import { useZodForm } from "@/utils/zodForm";
import { Events, User } from "@prisma/client";
import { useUpdateEvent } from "../hooks/useUpdateEvent";

type EditEventFormProps = {
  event?: Events & {
    host: User;
  };
  submit: (values: CreateEventSchemaType, successActions: () => void) => void;
};

const EditEventForm = (props: EditEventFormProps) => {
  const { event, submit } = props;
  const updateEventMutation = useUpdateEvent();

  const methods = useZodForm({
    schema: createEventSchema,
    defaultValues: {
      ...event,
      place: event?.place || undefined,
    },
  });

  return (
    <form
      onSubmit={methods.handleSubmit((values) => submit(values, methods.reset))}
      className={`form-control w-full max-w-xs gap-2`}
    >
      <Title methods={methods} />

      <TextInput
        name="time"
        label="Time"
        registerReturn={methods.register("time")}
        fieldError={methods.formState.errors.time}
      />

      <TextInput
        name="place"
        label="Place"
        registerReturn={methods.register("place")}
        fieldError={methods.formState.errors.place}
      />

      <Textarea
        name="description"
        label="Description"
        registerReturn={methods.register("description")}
        fieldError={methods.formState.errors.description}
      />

      <div className="py-2" />

      <button className="btn" type="submit">
        {!updateEventMutation.isLoading ? "Save" : <Spinner />}
      </button>
    </form>
  );
};

export default EditEventForm;
