import { type Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import { type User, type Event, type Attendee } from "@prisma/client";
import { api } from "../../utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { cn } from "../../utils/cn";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {
  event: Event & {
    host: User;
  };
};

export const Attendance = ({ event }: Props) => {
  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          <AttendButton event={event} />
          <Attendants event={event} />
        </div>
      </CardContent>
    </Card>
  );
};

type AttendButtonProps = {
  event: Event & {
    host: User;
  };
};

const AttendButton = ({ event }: AttendButtonProps) => {
  const session = useSession();
  const attendeesQuery = api.events.attendees.useQuery({
    publicId: event.publicId,
  });

  if (session.status === "loading") {
    return <Button variant={"outline"} className="w-full"></Button>;
  }

  if (session.status === "authenticated") {
    const currentAttendee = attendeesQuery.data?.find(
      (a) => a.userId === session.data.user.id,
    );

    return (
      <Attend
        session={session.data}
        event={event}
        currentAttendee={currentAttendee}
      />
    );
  }

  return (
    <Button asChild variant={"outline"} className="w-full">
      <Link href={"/api/auth/signin"}>Sign in to attend</Link>
    </Button>
  );
};

type AttendProps = {
  session: Session;
  event: Event & { host: User };
  currentAttendee?: Attendee;
};

const Attend = ({ session, event, currentAttendee }: AttendProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(
    currentAttendee?.name ?? session.user.name ?? session.user.email ?? "",
  );
  const updateAttendanceMutation = api.events.updateAttendance.useMutation({
    onSuccess: async () => {
      return await utils.events.attendees.refetch({
        publicId: event.publicId,
      });
    },
  });
  const utils = api.useUtils();

  const updateAttendance = async (status: "GOING" | "NOT_GOING" | "MAYBE") => {
    await updateAttendanceMutation.mutateAsync({
      publicId: event.publicId,
      userId: session.user.id,
      status,
      name: name ?? undefined,
    });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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

          <Button
            disabled={updateAttendanceMutation.isLoading}
            variant="outline"
            className={cn(
              "w-full",
              currentAttendee?.status === "GOING" && "bg-primary/20",
            )}
            onClick={() => updateAttendance("GOING")}
          >
            Going
          </Button>
          <Button
            disabled={updateAttendanceMutation.isLoading}
            variant="outline"
            className={cn(
              "w-full",
              currentAttendee?.status === "MAYBE" && "bg-primary/20",
            )}
            onClick={() => updateAttendance("MAYBE")}
          >
            Maybe
          </Button>
          <Button
            disabled={updateAttendanceMutation.isLoading}
            variant="outline"
            className={cn(
              "w-full",
              currentAttendee?.status === "NOT_GOING" && "bg-primary/20",
            )}
            onClick={() => updateAttendance("NOT_GOING")}
          >
            Not going
          </Button>
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
  const invited = attendees?.filter((a) => a.status === "INVITED") ?? [];

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
            <AttendingSection section="Invited" attendants={invited} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

type AttendingSectionProps = {
  section: "Going" | "Maybe" | "Not going" | "Invited";
  attendants: Attendee[];
};

const AttendingSection = ({ section, attendants }: AttendingSectionProps) => {
  if (!attendants.length) {
    return null;
  }
  return (
    <div>
      <p className="text-xs font-semibold text-primary">{section}</p>
      {attendants.map((attendant) => (
        <p key={attendant.attendeeId}>{attendant.name}</p>
      ))}
    </div>
  );
};

const attendanceStatusString = (
  status?: "GOING" | "NOT_GOING" | "MAYBE" | "UNKNOWN" | "INVITED",
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
