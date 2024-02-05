import { type Events, type User } from "@prisma/client";
import Link from "next/link";
import { api } from "../../utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";

type MyEventsProps = { email: string };

export const MyEvents = ({ email }: MyEventsProps) => {
  const { data: attendingEvents } = api.events.eventsAttendedByUser.useQuery({
    userEmail: email,
  });

  const { data: hostingEvents } = api.events.eventsHostedByUser.useQuery({
    userEmail: email,
  });

  return (
    <div className="px-4 py-8">
      <h1 className="py-2 text-center text-4xl font-extrabold">My Events</h1>

      <h2 className="py-4 text-xl font-extrabold">Attending</h2>
      <div className="flex flex-wrap justify-start gap-3 pb-4">
        {attendingEvents?.map((e) => (
          <Event event={e} key={`attendingEvent-${e.eventId}`} />
        ))}
      </div>

      <h2 className="py-4 text-xl font-extrabold">Hosting</h2>
      <div className="flex flex-wrap justify-start gap-3">
        {hostingEvents?.map((e) => (
          <Event event={e} key={`hostingEvents-${e.eventId}`} />
        ))}
      </div>
    </div>
  );
};

type EventProps = {
  event: Events & {
    host: User;
  };
};

const Event = (props: EventProps) => {
  const { event } = props;

  return (
    <Link href={`/events/${event.eventId}`}>
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>
            <p>{format(event.dateTime, "PP H:mm")}</p>
            <p>{event.host.name ?? event.host.email}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{event.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
