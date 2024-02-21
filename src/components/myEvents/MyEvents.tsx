import { type Attendees, type Events, type User } from "@prisma/client";
import Link from "next/link";
import { api } from "../../utils/api";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { Crown, MapPin, UsersRound } from "lucide-react";
import { WorkingClock } from "../WorkingClock";

type MyEventsProps = { email: string };

export const MyEvents = ({ email }: MyEventsProps) => {
  const { data: events } = api.events.myEvents.useQuery({
    userEmail: email,
  });

  return (
    <div className="flex max-w-4xl flex-col gap-8 p-4">
      <h1 className="py-2 text-4xl font-extrabold">Events</h1>

      {events?.map((event) => (
        <EventRow event={event} key={`event-${event.eventId}`} />
      ))}
    </div>
  );
};

type EventRowProps = { event: Events & { host: User; attendees: Attendees[] } };

const EventRow = ({ event }: EventRowProps) => {
  return (
    <div className="flex">
      <div className="w-32">
        <p>{format(event.dateTime, "d. MMM")}</p>
        <p className="text-primary/50">{format(event.dateTime, "eeee")}</p>
      </div>

      <Link
        href={`/events/${event.eventId}`}
        className="w-full hover:shadow-xl"
      >
        <Card>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <WorkingClock date={event.dateTime} size={16} />
                <p>{format(event.dateTime, "H:mm")}</p>
              </div>
              {event.place && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <p>{event.place}</p>
                </div>
              )}
              {!!event.attendees.length && (
                <div className="flex items-center gap-2">
                  <UsersRound size={16} />
                  <p>{event.attendees.length} attendees</p>
                </div>
              )}
              {event.hostId && (
                <div className="flex items-center gap-2">
                  <Crown size={16} />
                  <p>{event.host.name ?? event.host.email}</p>
                </div>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
};
