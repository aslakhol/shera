import Spinner from "@/components/Spinner";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

type LoggedInAttendProps = { eventId: number };

const LoggedInAttend = (props: LoggedInAttendProps) => {
  const { eventId } = props;
  const ctx = trpc.useContext();
  const { data: session } = useSession();
  const { data: attendees } = trpc.useQuery(["events.attendees", { eventId }]);
  const attendMutation = trpc.useMutation("events.attend", {});

  const attend = () => {
    if (!session?.user || !session.user.email) {
      return;
    }
    attendMutation.mutate(
      {
        email: session.user.email,
        name: session.user.name || session.user.email,
        eventId,
      },
      {
        onSuccess: () => {
          ctx.refetchQueries(["events.attendees", { eventId }]);
        },
      }
    );
  };

  const isAlreadyAttending = attendees?.some(
    (a) => a.email === session?.user?.email
  );

  if (isAlreadyAttending) {
    return <></>;
  }

  return (
    <button className="btn btn-outline" onClick={attend}>
      {!attendMutation.isLoading ? "Attend?" : <Spinner />}
    </button>
  );
};

export default LoggedInAttend;
