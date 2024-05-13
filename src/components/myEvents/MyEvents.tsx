import { type Attendee, type Event, type User } from "@prisma/client";
import Link from "next/link";
import { api } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { Crown, MapPin, Plus, UsersRound } from "lucide-react";
import { WorkingClock } from "../WorkingClock";
import { Button } from "../ui/button";
import { Loading } from "../Loading";
import { fullEventId } from "../../utils/event";
import { useSession } from "next-auth/react";

export const MyEvents = () => {
  const session = useSession();
  const { data: events, isSuccess } = api.events.myEvents.useQuery(
    {
      userId: session.data?.user.id ?? "",
    },
    {
      enabled: !!session.data?.user.id,
    },
  );

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="py-2 text-4xl font-extrabold text-primary">Events</h1>
        <Button asChild variant="outline">
          <Link href="/events/new">
            <Plus />
          </Link>
        </Button>
      </div>

      {session.status === "unauthenticated" && (
        <div className="flex w-full justify-center">
          <p>You need to be logged in to view your events</p>
        </div>
      )}

      {(!isSuccess || session.status === "loading") && (
        <div className="flex w-full justify-center">
          <Loading />
        </div>
      )}

      {events?.map((event) => (
        <EventRow event={event} key={`event-${event.publicId}`} />
      ))}

      {isSuccess && (
        <Button asChild variant="outline">
          <Link href="/events/new">New event</Link>
        </Button>
      )}
    </div>
  );
};

type EventRowProps = { event: Event & { host: User; attendees: Attendee[] } };

const EventRow = ({ event }: EventRowProps) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-32 pb-2">
        <p>{format(event.dateTime, "d. MMM")}</p>
        <p className="text-primary/50">{format(event.dateTime, "eeee")}</p>
      </div>

      <Link
        href={`/events/${fullEventId(event)}`}
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
                  <p>
                    {event.attendees.filter((a) => a.status === "GOING").length}{" "}
                    attendees
                  </p>
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
