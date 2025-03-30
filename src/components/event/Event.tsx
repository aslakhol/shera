import { format } from "date-fns";
import { api } from "../../utils/api";
import { Body } from "./Body";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Crown, MapPin } from "lucide-react";
import { WorkingClock } from "../WorkingClock";
import { Loading } from "../Loading";

import dynamic from "next/dynamic";
import { Attendance } from "./Attendance";
import NewPost from "../post/NewPost";
import PostList from "../post/PostList";
import { AddToCalendar } from "./AddToCalendar";
import { Button } from "../ui/button";
import { infoBoxFormatHostNames } from "../../../emails/utils";

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

  const isHost = event.hosts.some((host) => host.id === session?.user?.id);

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
        <div className="flex items-center gap-2">
          <Crown size={16} />
          <p>{infoBoxFormatHostNames(event.hosts)}</p>
        </div>
      </div>
      <Attendance event={event} />

      <Body description={event.description} />
      <div className="flex flex-wrap justify-start gap-2">
        <Invite event={event} />
        <AddToCalendar event={event} />
        <NewPost publicId={publicId} isHost={isHost} />
        {isHost && (
          <Button asChild variant={"outline"} className="gap-2">
            <Link href={`/events/${publicId}/edit`}>
              <p>Edit event</p>
            </Link>
          </Button>
        )}
      </div>

      <PostList publicId={publicId} />
    </div>
  );
};
