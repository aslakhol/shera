import { Events, User } from "@prisma/client";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

type MyEventsProps = { email: string };

const MyEvents = (props: MyEventsProps) => {
  const { email } = props;

  const { data: attendingEvents } = trpc.useQuery([
    "events.events-attended-by-user",
    { userEmail: email },
  ]);

  const { data: hostingEvents } = trpc.useQuery([
    "events.events-hosted-by-user",
    { userEmail: email },
  ]);

  return (
    <div className="p-4">
      <h1 className="font-extrabold text-3xl text-center">My Events</h1>

      <h2 className="font-extrabold text-xl p-4">Attending</h2>
      <div className="flex gap-3 flex-wrap justify-center">
        {attendingEvents?.map((e) => (
          <Event event={e} key={`attendingEvent-${e.eventId}`} />
        ))}
      </div>

      <h2 className="font-extrabold text-xl p-4">Hosting</h2>
      <div className="flex gap-3 flex-wrap justify-center">
        {hostingEvents?.map((e) => (
          <Event event={e} key={`hostingEvents-${e.eventId}`} />
        ))}
      </div>
    </div>
  );
};

export default MyEvents;

type EventProps = {
  event: Events & {
    host: User;
  };
};

const Event = (props: EventProps) => {
  const { event } = props;

  return (
    <Link href={`/events/${event.eventId}`}>
      <div className="card w-96 bg-base-100 shadow-xl cursor-pointer hover:shadow-secondary-content">
        <div className="card-body">
          <h2 className="card-title">{event.title}</h2>
          <div className="my-2 flex flex-col gap-2">
            <p>Host: {event.host.name || event.host.email}</p>
            <p className="line-clamp-3 ">{event.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
