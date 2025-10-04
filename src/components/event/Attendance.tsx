import { type Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

import { type Attendee, type AttendingStatus } from "@prisma/client";
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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type EventWithHosts } from "../../utils/types";

type Props = {
  event: EventWithHosts;
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
  event: EventWithHosts;
};

const AttendButton = ({ event }: AttendButtonProps) => {
  const session = useSession();
  const attendeesQuery = api.events.attendees.useQuery({
    publicId: event.publicId,
  });

  if (session.status === "loading") {
    return <Button variant={"outline"} className="w-full"></Button>;
  }

  const currentAttendee = attendeesQuery.data?.find(
    (a) => a.userId === session.data?.user.id,
  );

  return (
    <Attend
      session={session.data}
      event={event}
      currentAttendee={currentAttendee}
    />
  );
};

type AttendProps = {
  session: Session | null;
  event: EventWithHosts;
  currentAttendee?: Attendee;
};

const Attend = ({ session, event, currentAttendee }: AttendProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const [name, setName] = useState(
    currentAttendee?.name ?? session?.user.name ?? "",
  );
  const updateAttendanceMutation = api.events.updateAttendance.useMutation({
    onSuccess: async () => {
      return await utils.events.attendees.refetch({
        publicId: event.publicId,
      });
    },
  });
  const utils = api.useUtils();
  const attendanceDisabled = updateAttendanceMutation.isLoading || !name;

  const updateAttendance = async (status: "GOING" | "NOT_GOING" | "MAYBE") => {
    if (!session) {
      const url = new URL(router.asPath, window.location.origin);
      url.searchParams.set("attendance", status);
      url.searchParams.set("name", name);

      await signIn(undefined, {
        callbackUrl: url.pathname + url.search,
      });
      return;
    }

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
            disabled={attendanceDisabled}
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
            disabled={attendanceDisabled}
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
            disabled={attendanceDisabled}
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

type AttendantsProps = { event: EventWithHosts };

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
      <DialogContent className="max-h-full overflow-y-scroll">
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

const attendanceStatusString = (status?: AttendingStatus) => {
  if (status === "NOT_GOING") {
    return "Not going";
  }
  if (status === "MAYBE") {
    return "Maybe";
  }
  if (status === "GOING") {
    return "Going";
  }

  return "Are you going?";
};
