import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Attend from "./Attend";
import Attending from "./Attending";
import EventBody from "./EventBody";

type EventProps = { eventId: string };

const Event = (props: EventProps) => {
  const { eventId } = props;
  const { data: session } = useSession();

  const { data: event, isSuccess } = trpc.useQuery([
    "events.event",
    { eventId },
  ]);

  if (!isSuccess) {
    return <></>;
  }

  if (event === null) {
    return <>No event with id {eventId}</>;
  }

  return (
    <div className="flex flex-col gap-4 items-center min-h-screen mx-auto py-8 w-10/12 md:w-1/2">
      <div className="prose">
        <h1 className="py-2 text-center">{event.title}</h1>
      </div>

      <div className="info flex flex-col gap-2">
        <span>Time: {event.time}</span>
        <span>Place: {event.place}</span>
        <span>Host: {event.host.name || event.host.email}</span>
      </div>

      <div className="flex gap-2">
        <Attending eventId={event.eventId} />
        <Attend eventId={event.eventId} />
      </div>

      <EventBody description={event.description} />

      <div className="py-2" />
      {session?.user?.email === event.host.email && (
        <Link href={`/events/${eventId}/edit`}>
          <button className="btn">Edit event</button>
        </Link>
      )}
    </div>
  );
};

export default Event;
