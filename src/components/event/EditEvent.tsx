import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type EventSchemaType } from "../../utils/formValidation";
import { EventForm } from "../EventForm";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { fullEventId } from "../../utils/event";

type Props = { publicId: string };

export const EditEvent = ({ publicId }: Props) => {
  const session = useSession();
  const router = useRouter();
  const eventQuery = api.events.event.useQuery({
    publicId,
  });
  const updateEventMutation = api.events.updateEvent.useMutation({
    onSuccess: (response) => {
      toast.success(`${response.event.title} updated`);
      void router.push(`/events/${fullEventId(response.event)}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createEvent = (values: EventSchemaType) => {
    if (!session.data?.user) {
      return;
    }

    updateEventMutation.mutate({ publicId, ...values });
  };

  if (eventQuery.status === "loading" || !eventQuery.data) {
    return <Loading />;
  }

  if (session.data?.user.id !== eventQuery.data.host.id) {
    return <>No access to edit event</>;
  }

  return (
    <EventForm
      onSubmit={createEvent}
      event={eventQuery.data}
      mutationIsIdle={updateEventMutation.isIdle}
    />
  );
};
