import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { type EventSchemaType } from "../utils/formValidation";
import { EventForm } from "./EventForm";
import { toast } from "sonner";

export const CreateEvent = () => {
  const session = useSession();
  const createEventMutation = api.events.createEvent.useMutation({
    onSuccess: (response) => {
      toast.success(`${response.event.title} created!`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createEvent = (values: EventSchemaType) => {
    if (!session.data?.user) {
      return;
    }

    createEventMutation.mutate({ userId: session.data.user.id, ...values });
  };

  return <EventForm onSubmit={createEvent} />;
};

// Make event page
// Redirect to event page
// Edit event
