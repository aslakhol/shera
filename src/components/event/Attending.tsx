import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type Attendees } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

type Props = { eventId: number };

const Attending = ({ eventId }: Props) => {
  const { data: attendees, isSuccess } = api.events.attendees.useQuery({
    eventId,
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
              eventId={eventId}
              attendee={attendee}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default Attending;

type AttendeeProps = { eventId: number; attendee: Attendees };

const Attendee = (props: AttendeeProps) => {
  const { eventId, attendee } = props;
  const utils = api.useUtils();
  const { data: session } = useSession();
  const unattendMutation = api.events.unattend.useMutation();

  const isMe = attendee.email === session?.user.email;

  const unattend = () => {
    unattendMutation.mutate(
      { attendeeId: attendee.attendeeId },
      {
        onSuccess: () => {
          void utils.events.attendees.invalidate({ eventId });
        },
      },
    );
  };

  return (
    <li className={`flex gap-2`}>
      <span className={isMe ? "underline" : ""}>{attendee.name}</span>
      {isMe && (
        <span className="btn btn-ghost btn-xs" onClick={unattend}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}
    </li>
  );
};
