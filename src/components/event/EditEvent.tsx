import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type EventSchemaType } from "../../utils/formValidation";
import { EventForm } from "../EventForm";
import { toast } from "sonner";
import { useRouter } from "next/router";

type Props = { eventId: number };

export const EditEvent = ({ eventId }: Props) => {
  const session = useSession();
  const router = useRouter();
  const eventQuery = api.events.event.useQuery({
    eventId,
  });
  const updateEventMutation = api.events.updateEvent.useMutation({
    onSuccess: (response) => {
      toast.success(`${response.event.title} updated`);
      void router.push(`/events/${response.event.eventId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createEvent = (values: EventSchemaType) => {
    if (!session.data?.user) {
      return;
    }

    updateEventMutation.mutate({ eventId, ...values });
  };

  if (eventQuery.status === "loading" || !eventQuery.data) {
    return <>Loading...</>;
  }

  if (session.data?.user.id !== eventQuery.data.host.id) {
    return <>No access to edit event</>;
  }

  return <EventForm onSubmit={createEvent} event={eventQuery.data} />;
};
