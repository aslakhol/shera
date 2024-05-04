import { type Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import { type User, type Event, type Attendee } from "@prisma/client";
import { api } from "../../utils/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { cn } from "../../utils/cn";

type Props = {
  session: Session | null;
  event: Event & {
    host: User;
  };
};

export const NewAttend = ({ session, event }: Props) => {
  const { data: attendees } = api.events.attendees.useQuery({
    publicId: event.publicId,
  });
  const currentAttendee = attendees?.find((a) => a.userId === session?.user.id);

  if (!session) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <Attend
            session={session}
            event={event}
            currentAttendee={currentAttendee}
          />
          <Attendants event={event} />
        </div>
      </CardContent>
    </Card>
  );
};

type AttendProps = {
  session: Session;
  event: Event & { host: User };
  currentAttendee?: Attendee;
};

const Attend = ({ session, event, currentAttendee }: AttendProps) => {
  const [name, setName] = useState(
    currentAttendee?.name ?? session.user.name ?? "",
  );
  const updateAttendanceMutation = api.events.updateAttendance.useMutation();
  const utils = api.useUtils();

  const updateAttendance = async (status: "GOING" | "NOT_GOING" | "MAYBE") => {
    updateAttendanceMutation.mutate(
      {
        publicId: event.publicId,
        userId: session.user.id,
        status,
        name: name ?? undefined,
      },
      {
        onSuccess: () => {
          void utils.events.attendees.invalidate({ publicId: event.publicId });
        },
      },
    );
  };

  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger className="w-full">
          {attendanceStatusString(currentAttendee?.status)}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">
            Are you going to {event.title}?:
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="grid w-full  gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <DialogClose asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full",
                currentAttendee?.status === "GOING" && "bg-primary/20",
              )}
              onClick={() => updateAttendance("GOING")}
            >
              Going
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full",
                currentAttendee?.status === "MAYBE" && "bg-primary/20",
              )}
              onClick={() => updateAttendance("MAYBE")}
            >
              Maybe
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full",
                currentAttendee?.status === "NOT_GOING" && "bg-primary/20",
              )}
              onClick={() => updateAttendance("NOT_GOING")}
            >
              Not going
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type AttendantsProps = { event: Event & { host: User } };

const Attendants = ({ event }: AttendantsProps) => {
  const { data: attendees, isSuccess } = api.events.attendees.useQuery({
    publicId: event.publicId,
  });

  const going = attendees?.filter((a) => a.status === "GOING") ?? [];
  const maybe = attendees?.filter((a) => a.status === "MAYBE") ?? [];
  const notGoing = attendees?.filter((a) => a.status === "NOT_GOING") ?? [];

  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger>
          {attendees?.filter((a) => a.status === "GOING")?.length ?? 0} going
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Attendees:</DialogTitle>
        </DialogHeader>
        {isSuccess && (
          <div>
            <AttendingSection section="Going" attendants={going} />
            <AttendingSection section="Maybe" attendants={maybe} />
            <AttendingSection section="Not going" attendants={notGoing} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

type AttendingSectionProps = {
  section: "Going" | "Maybe" | "Not going";
  attendants: Attendee[];
};

const AttendingSection = ({ section, attendants }: AttendingSectionProps) => {
  if (!attendants.length) {
    return null;
  }
  return (
    <div>
      <p className="text-xs font-semibold  text-primary">{section}</p>
      {attendants.map((attendant) => (
        <p key={attendant.attendeeId}>{attendant.name}</p>
      ))}
    </div>
  );
};

const attendanceStatusString = (
  status?: "GOING" | "NOT_GOING" | "MAYBE" | "UNKNOWN",
) => {
  if (status === "NOT_GOING") {
    return "Not going";
  }
  if (status === "MAYBE") {
    return "Maybe";
  }
  if (status === "GOING") {
    return "Going";
  }
  return "Going?";
};
