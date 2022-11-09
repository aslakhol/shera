import { EventSchemaType } from "@/features/eventForm/formValidation";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUpdateEvent } from "../hooks/useUpdateEvent";
import EventForm from "./EventForm";

type EditEventProps = { eventId: string };

const EditEvent = (props: EditEventProps) => {
  const { eventId } = props;
  const { data: session, status } = useSession();
  const router = useRouter();
  const updateEventMutation = useUpdateEvent();

  const {
    data: event,
    isSuccess,
    error,
  } = trpc.useQuery([
    "events.event",
    {
      eventId,
    },
  ]);

  if (error) {
    return <div className="h-screen">{error.message}</div>;
  }

  if (!isSuccess || status !== "authenticated") {
    return <div className="h-screen"></div>;
  }

  if (session.user.id !== event.host.id) {
    return <>You are not the host of this event</>;
  }

  const handleSubmit = (
    values: EventSchemaType,
    successActions: () => void
  ) => {
    updateEventMutation.mutate(
      {
        ...values,
        dateTime: new Date(values.dateTime),
        eventId: event.eventId,
      },
      {
        onSuccess: (result) => {
          router.push(`/events/${result.event.eventId}`);
          successActions();
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen-content mx-auto py-8 w-10/12 md:w-1/2">
      <div className="prose">
        <h1 className="py-2 text-center">Edit {event.title}</h1>
      </div>
      <EventForm event={event} submit={handleSubmit} submitLabel="Save" />
    </div>
  );
};

export default EditEvent;
