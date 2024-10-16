import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type EventSchemaType } from "../../utils/formValidation";
import { EventForm } from "../EventForm";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { fullEventId } from "../../utils/event";

export const CreateEvent = () => {
  const session = useSession();
  const router = useRouter();
  const createEventMutation = api.events.createEvent.useMutation({
    onSuccess: (response) => {
      toast.success(`${response.event.title} created!`);
      return router.push(`/events/${fullEventId(response.event)}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createEvent = (values: EventSchemaType) => {
    if (!session.data?.user) {
      return;
    }

    createEventMutation.mutate({
      userId: session.data.user.id,
      ...values,
      notify: false,
    });
  };

  return (
    <EventForm
      onSubmit={createEvent}
      mutationIsLoading={createEventMutation.isLoading}
    />
  );
};
