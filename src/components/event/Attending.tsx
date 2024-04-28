import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type Attendee } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Redo, X } from "lucide-react";
import { Loading } from "../Loading";
import { cn } from "../../utils/cn";

type Props = { publicId: string };

const Attending = ({ publicId }: Props) => {
  const { data: attendees, isSuccess } = api.events.attendees.useQuery({
    publicId,
  });

  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger>{attendees?.length ?? 0} going</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendees:</DialogTitle>
        </DialogHeader>
        {isSuccess &&
          attendees.map((attendee) => (
            <Attendee
              key={attendee.attendeeId}
              publicId={publicId}
              attendee={attendee}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default Attending;

type AttendeeProps = { publicId: string; attendee: Attendee };

const Attendee = (props: AttendeeProps) => {
  const { publicId, attendee } = props;
  const { data: session } = useSession();

  const isMe =
    attendee.email === session?.user.email ||
    attendee.userId === session?.user.id;

  return (
    <li className={`flex gap-2`}>
      <span
        className={cn(
          isMe && "underline",
          attendee.status === "NOT_GOING" &&
            "text-muted-foreground line-through",
        )}
      >
        {attendee.name} {attendee.status === "NOT_GOING" && "(not going)"}
      </span>
      {isMe && attendee.status !== "NOT_GOING" && (
        <Unattend publicId={publicId} attendee={attendee} />
      )}
      {isMe && attendee.status === "NOT_GOING" && (
        <Reattend publicId={publicId} attendee={attendee} />
      )}
    </li>
  );
};

type UnattendProps = {
  publicId: string;
  attendee: Attendee;
};

const Unattend = ({ publicId, attendee }: UnattendProps) => {
  const utils = api.useUtils();
  const unattendMutation = api.events.unattend.useMutation();
  const unattend = () => {
    unattendMutation.mutate(
      { attendeeId: attendee.attendeeId },
      {
        onSuccess: () => {
          void utils.events.attendees.invalidate({ publicId });
        },
      },
    );
  };

  if (!unattendMutation.isIdle) {
    return <Loading />;
  }

  return <X onClick={unattend} className="pointer underline" />;
};

type ReattendProps = {
  publicId: string;
  attendee: Attendee;
};

const Reattend = ({ publicId, attendee }: ReattendProps) => {
  const utils = api.useUtils();
  const reattendMutation = api.events.reattend.useMutation();

  const reattend = () => {
    reattendMutation.mutate(
      {
        attendeeId: attendee.attendeeId,
      },
      {
        onSuccess: () => {
          void utils.events.attendees.invalidate({ publicId });
        },
      },
    );
  };

  if (!reattendMutation.isIdle) {
    return <Loading />;
  }

  return <Redo onClick={reattend} className="pointer underline" />;
};
