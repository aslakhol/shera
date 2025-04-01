import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type EventSchemaType } from "../../utils/formValidation";
import { EventForm } from "../EventForm";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { fullEventId } from "../../utils/event";
import { EventHosts } from "./EventHosts";

type Props = { publicId: string };

export const EditEvent = ({ publicId }: Props) => {
  const session = useSession();
  const router = useRouter();

  const eventQuery = api.events.event.useQuery(
    {
      publicId,
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  const updateEventMutation = api.events.updateEvent.useMutation({
    onSuccess: (response) => {
      toast.success(`${response.event.title} updated`);
      return router.push(`/events/${fullEventId(response.event)}`);
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const handleUpdateEvent = (values: EventSchemaType) => {
    if (!session.data?.user) {
      return;
    }
    updateEventMutation.mutate({ publicId, ...values });
  };

  if (eventQuery.isLoading || !eventQuery.data) {
    return <Loading />;
  }

  const currentUserId = session.data?.user?.id;
  const isHost = !!eventQuery.data?.hosts.some(
    (host) => host.id === currentUserId,
  );

  if (!isHost) {
    if (session.status === "loading") {
      return <Loading />;
    }
    if (eventQuery.status === "success" && !eventQuery.data) {
      return <>Event not found</>;
    }
    return <>No access to edit event</>;
  }

  const eventData = eventQuery.data;

  return (
    <div className="space-y-6">
      <EventForm
        onSubmit={handleUpdateEvent}
        event={eventData}
        mutationIsLoading={updateEventMutation.isLoading}
      />

      <EventHosts event={eventData} />
    </div>
  );
};
