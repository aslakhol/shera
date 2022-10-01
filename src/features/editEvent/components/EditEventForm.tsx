import Spinner from "@/components/Spinner";
import Textarea from "@/components/Textarea";
import TextInput from "@/components/TextInput";
import Title from "@/features/newEvent/components/Title";
import { createEventSchema } from "@/features/newEvent/formValidation";
import { useZodForm } from "@/utils/zodForm";
import { Events, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUpdateEvent } from "../hooks/useUpdateEvent";

type EditEventFormProps = {
  event: Events & {
    host: User;
  };
};

const EditEventForm = (props: EditEventFormProps) => {
  const { event } = props;
  const router = useRouter();
  const updateEventMutation = useUpdateEvent();

  const methods = useZodForm({
    schema: createEventSchema,
    defaultValues: {
      title: event.title,
      time: event.time,
      description: event.description,
      place: event.place || undefined,
    },
  });

  const { data: session } = useSession();

  if (session === undefined) {
    return <></>;
  }

  if (session === null || !session.user?.id) {
    return <>Not logged in</>;
  }

  if (session.user.id !== event.host.id) {
    return <>You are not the host of this event</>;
  }

  return (
    <form
      onSubmit={methods.handleSubmit(async (values) => {
        updateEventMutation.mutate(
          {
            ...values,
            eventId: event.eventId,
          },
          {
            onSuccess: (result) => {
              methods.reset();
              router.push(`/events/${result.event.eventId}`);
            },
          }
        );
      })}
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
