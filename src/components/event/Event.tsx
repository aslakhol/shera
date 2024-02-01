import { format } from "date-fns";
import { api } from "../../utils/api";
import { Body } from "./Body";
import GoogleCalendar from "./GoogleCalendar";
import { useSession } from "next-auth/react";
import Attending from "./Attending";
import Link from "next/link";
import { Attend } from "./Attend";
import { LoggedInAttend } from "./LoggedInAttend";

type Props = { eventId: number };

export const Event = ({ eventId }: Props) => {
  const { data: event, isSuccess } = api.events.event.useQuery({ eventId });
  const { data: session } = useSession();

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event {eventId} not found</div>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{event.title}</h2>
      <div className="info flex flex-col gap-2">
        <span>When: {format(event.dateTime, "PP H:mm")}</span>
        <span>Place: {event.place}</span>
        <span>Host: {event.host.name ?? event.host.email}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Attending eventId={event.eventId} />

        {session?.user ? (
          <LoggedInAttend eventId={event.eventId} />
        ) : (
          <Attend eventId={event.eventId} />
        )}
        {session?.user?.id === event.host.id && (
          <Link href={`/events/${eventId}/edit`}>
            <button className="btn btn-outline">Edit event</button>
          </Link>
        )}
        {/* <Invite event={event} /> */}
      </div>
      <Body description={event.description} />

      <GoogleCalendar event={event} />

      <>Posts</>
    </>
  );
};
