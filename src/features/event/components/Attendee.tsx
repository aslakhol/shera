import { trpc } from "@/utils/trpc";
import type { Attendees } from "@prisma/client";
import { useSession } from "next-auth/react";

type AttendeeProps = { eventId: number; attendee: Attendees };

const Attendee = (props: AttendeeProps) => {
  const { eventId, attendee } = props;
  const ctx = trpc.useContext();
  const { data: session } = useSession();
  const unattendMutation = trpc.useMutation("events.unattend", {});

  const isMe = attendee.email === session?.user.email;

  const unattend = () => {
    unattendMutation.mutate(
      { attendeeId: attendee.attendeeId },
      {
        onSuccess: () => {
          ctx.refetchQueries(["events.attendees", { eventId }]);
        },
      }
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

export default Attendee;
