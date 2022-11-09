import Spinner from "@/components/Spinner";
import {
  eventSchema,
  EventSchemaType,
} from "@/features/eventForm/formValidation";
import { useZodForm } from "@/utils/zodForm";
import { Events, User } from "@prisma/client";
import { formatISO } from "date-fns";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import DateTime from "./DateTime";
import Description from "./Description";
import Place from "./Place";
import Time from "./Time";
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
      dateTime: event && formatISO(event.dateTime).split("+")[0],
      place: event?.place || undefined,
    },
  });

  return (
    <form
      onSubmit={methods.handleSubmit((values) => submit(values, methods.reset))}
      className={`form-control w-full max-w-xs gap-2`}
    >
      <Title methods={methods} />
      <Time methods={methods} />
      <DateTime methods={methods} />
      <Place methods={methods} />
      <Description methods={methods} />
      <div className="py-2" />
      <button className="btn" type="submit">
        {!updateEventMutation.isLoading ? submitLabel : <Spinner />}
      </button>
    </form>
  );
};

export default EventForm;
