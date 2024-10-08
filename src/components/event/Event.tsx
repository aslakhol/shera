import { format } from "date-fns";
import { api } from "../../utils/api";
import { Body } from "./Body";
import GoogleCalendar from "./GoogleCalendar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Crown, MapPin, Pencil } from "lucide-react";
import { WorkingClock } from "../WorkingClock";
import { Loading } from "../Loading";

import dynamic from "next/dynamic";
import { Attendance } from "./Attendance";
import NewPost from "../post/NewPost";
import PostList from "../post/PostList";

const Invite = dynamic(() => import("../invite/Invite"), {
  ssr: false,
});

type Props = { publicId: string };

export const Event = ({ publicId }: Props) => {
  const { data: event, isSuccess } = api.events.event.useQuery({ publicId });
  const { data: session } = useSession();

  if (!isSuccess) {
    return <Loading />;
  }

  if (!event) {
    return <div>Event {publicId} not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold tracking-tight text-primary">
        {event.title}
      </h2>

      <div className="text-lg">
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
        {session?.user?.id === event.host.id && (
          <div className="flex items-center gap-2">
            <Pencil size={16} />
            <Link href={`/events/${publicId}/edit`}>
              <p className="underline">Edit event</p>
            </Link>
          </div>
        )}
      </div>
      <Attendance event={event} />

      <Body description={event.description} />
      <div className="flex flex-wrap justify-start gap-2">
        <Invite event={event} />
        <GoogleCalendar event={event} />
        <NewPost publicId={publicId} />
      </div>

      <PostList publicId={publicId} />
    </div>
  );
};
