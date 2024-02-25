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
import { X } from "lucide-react";

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

type AttendeeProps = { eventId: number; attendee: Attendee };

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
      {isMe && <X onClick={unattend} className="underline" />}
    </li>
  );
};
