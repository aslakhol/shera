import { type Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import { type User, type Event } from "@prisma/client";
import { api } from "../../utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Props = {
  session: Session | null;
  event: Event & {
    host: User;
  };
};

export const NewAttend = ({ session, event }: Props) => {
  if (!session) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <Button type="submit" variant="outline" className="w-full">
            Going?
          </Button>
          <Attendants event={event} />
        </div>
      </CardContent>
    </Card>
  );
};

type AttendantsProps = { event: Event & { host: User } };

const Attendants = ({ event }: AttendantsProps) => {
  const { data: attendees, isSuccess } = api.events.attendees.useQuery({
    publicId: event.publicId,
  });
  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger>
          {attendees?.filter((a) => a.status === "GOING")?.length ?? 0} going
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendees:</DialogTitle>
        </DialogHeader>
        {isSuccess &&
          attendees.map((attendee) => (
            <p key={attendee.attendeeId}>
              {attendee.name} {attendee.status === "NOT_GOING" && "(not going)"}
            </p>
          ))}
      </DialogContent>
    </Dialog>
  );
};
