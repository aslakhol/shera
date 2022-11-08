import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Posts from "../../post/components/Posts";
import Attend from "./Attend";
import Attending from "./Attending";
import EventBody from "./EventBody";

type EventProps = { eventId: string };

const Event = (props: EventProps) => {
  const { eventId } = props;
  const { data: session } = useSession();

  const {
    data: event,
    isSuccess,
    error,
  } = trpc.useQuery(["events.event", { eventId }], {});

  if (error) {
    return <div className="h-screen">{error.message}</div>;
  }

  if (!isSuccess) {
    return <div className="h-screen"></div>;
  }

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen-content mx-auto py-8 w-10/12 md:w-1/2">
      <div className="prose">
        <h1 className="py-2 text-center">{event.title}</h1>
      </div>

      <div className="info flex flex-col gap-2">
        <span>(Old)Time: {event.time}</span>
        <span>When: {event.dateTime.toLocaleString()}</span>
        <span>Place: {event.place}</span>
        <span>Host: {event.host.name || event.host.email}</span>
      </div>

      <div className="flex gap-2">
        <Attending eventId={event.eventId} />
        <Attend eventId={event.eventId} />
        {session?.user?.id === event.host.id && (
          <Link href={`/events/${eventId}/edit`}>
            <button className="btn btn-outline">Edit event</button>
          </Link>
        )}
      </div>

      <EventBody description={event.description} />

      <Posts eventId={eventId} />
    </div>
  );
};

export default Event;
