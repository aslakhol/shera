import { type Attendees, type Events, type User } from "@prisma/client";
import Link from "next/link";
import { api } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { Crown, MapPin, Plus, UsersRound } from "lucide-react";
import { WorkingClock } from "../WorkingClock";
import { Button } from "../ui/button";
import { Loading } from "../Loading";

type MyEventsProps = { email: string };

export const MyEvents = ({ email }: MyEventsProps) => {
  const { data: events, isSuccess } = api.events.myEvents.useQuery({
    userEmail: email,
  });

  return (
    <div className="flex min-w-96 max-w-4xl flex-col gap-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="py-2 text-4xl font-extrabold text-primary">Events</h1>
        <Button asChild variant="outline">
          <Link href="/events/new">
            <Plus />
          </Link>
        </Button>
      </div>

      {!isSuccess && <Loading />}

      {events?.map((event) => (
        <EventRow event={event} key={`event-${event.eventId}`} />
      ))}

      <Button asChild variant="outline">
        <Link href="/events/new">New event</Link>
      </Button>
    </div>
  );
};

type EventRowProps = { event: Events & { host: User; attendees: Attendees[] } };

const EventRow = ({ event }: EventRowProps) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-32 pb-2">
        <p>{format(event.dateTime, "d. MMM")}</p>
        <p className="text-primary/50">{format(event.dateTime, "eeee")}</p>
      </div>

      <Link
        href={`/events/${event.eventId}`}
        className="w-full hover:shadow-xl"
      >
        <Card>
          <CardHeader className="py-5">
            <CardTitle className="w-72 overflow-hidden text-ellipsis text-nowrap text-lg">
              {event.title}
            </CardTitle>
            <CardContent className="p-0 text-sm text-muted-foreground">
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

                  <div>
                    <p className="w-72 overflow-hidden text-ellipsis text-nowrap">
                      {event.host.name ?? event.host.email}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
};
