import Spinner from "@/components/Spinner";
import Textarea from "@/components/Textarea";
import TextInput from "@/components/TextInput";
import {
  eventSchema,
  EventSchemaType,
} from "@/features/eventForm/formValidation";
import { useZodForm } from "@/utils/zodForm";
import { Events, User } from "@prisma/client";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import Title from "./Title";

type EventFormProps = {
  event?: Events & {
    host: User;
  };
  submit: (values: EventSchemaType, successActions: () => void) => void;
  submitLabel: string;
};

const EventForm = (props: EventFormProps) => {
  const { event, submit, submitLabel } = props;
  const updateEventMutation = useUpdateEvent();

  const methods = useZodForm({
    schema: eventSchema,
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
        {!updateEventMutation.isLoading ? submitLabel : <Spinner />}
      </button>
    </form>
  );
};

export default EventForm;
