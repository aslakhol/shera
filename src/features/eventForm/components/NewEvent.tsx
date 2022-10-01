import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { EventSchemaType } from "../formValidation";
import { useCreateEvent } from "../hooks/useCreateEvent";
import EventForm from "./EventForm";

const NewEvent = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const createEventMutation = useCreateEvent();

  if (status !== "authenticated" || !session.user.id) {
    return <div className="h-screen"></div>;
  }

  const userId = session.user.id;

  const handleSubmit = (
    values: EventSchemaType,
    successActions: () => void
  ) => {
    createEventMutation.mutate(
      {
        ...values,
        userId: userId,
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
        <h1 className="py-2 text-center">Create an event</h1>
      </div>
      <EventForm submit={handleSubmit} submitLabel={"Create"} />
    </div>
  );
};

export default NewEvent;
