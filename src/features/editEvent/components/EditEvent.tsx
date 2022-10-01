import { trpc } from "@/utils/trpc";
import EditEventForm from "./EditEventForm";

type EditEventProps = { eventId: string };

const EditEvent = (props: EditEventProps) => {
  const { eventId } = props;

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

  if (!isSuccess) {
    return <div className="h-screen"></div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen-content mx-auto py-8 w-10/12 md:w-1/2">
      <div className="prose">
        <h1 className="py-2 text-center">Edit {event.title}</h1>
      </div>
      <EditEventForm event={event} />
    </div>
  );
};

export default EditEvent;
