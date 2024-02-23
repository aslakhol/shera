import { format } from "date-fns";
import { api } from "../../utils/api";
import { Body } from "./Body";
import GoogleCalendar from "./GoogleCalendar";
import { useSession } from "next-auth/react";
import Attending from "./Attending";
import Link from "next/link";
import { Attend } from "./Attend";
import { LoggedInAttend } from "./LoggedInAttend";
import Invite from "../invite/Invite";
import { Button } from "../ui/button";
import Posts from "../post/Posts";
import { Crown, MapPin } from "lucide-react";
import { WorkingClock } from "../WorkingClock";

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
      <div className="flex max-w-4xl flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          {event.title}
        </h2>

        <div className="text-lg ">
          <div className="flex items-center gap-2">
            <WorkingClock date={event.dateTime} size={16} />
            <p>{format(event.dateTime, "EEEE, LLLL do, H:mm")}</p>
          </div>
          {event.place && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <p>{event.place}</p>
            </div>
          )}
          {event.hostId && (
            <div className="flex items-center gap-2">
              <Crown size={16} />
              <p>{event.host.name ?? event.host.email}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-start gap-2">
          <Attending eventId={event.eventId} />

          {session?.user ? (
            <LoggedInAttend eventId={event.eventId} />
          ) : (
            <Attend eventId={event.eventId} />
          )}
          {session?.user?.id === event.host.id && (
            <Link href={`/events/${eventId}/edit`}>
              <Button variant={"outline"}>Edit event</Button>
            </Link>
          )}
          <Invite event={event} />
          <GoogleCalendar event={event} />
        </div>
        <Body description={event.description} />

        <Posts eventId={eventId} />
      </div>
    </>
  );
};
