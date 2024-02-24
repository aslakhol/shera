import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { Button } from "../ui/button";
import { Loading } from "../Loading";

type Props = { eventId: number };

export const LoggedInAttend = ({ eventId }: Props) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const { data: attendees } = api.events.attendees.useQuery({ eventId });
  const attendMutation = api.events.attend.useMutation();

  const attend = () => {
    if (!session?.user || !session.user.email) {
      return;
    }

    attendMutation.mutate(
      {
        email: session.user.email,
        name: session.user.name ?? session.user.email,
        eventId,
      },
      {
        onSuccess: () => {
          void utils.events.attendees.invalidate({ eventId });
        },
      },
    );
  };

  const isAlreadyAttending = attendees?.some(
    (a) => a.email === session?.user?.email,
  );

  if (isAlreadyAttending) {
    return <></>;
  }

  return (
    <Button variant="outline" onClick={attend}>
      {!attendMutation.isLoading ? "Attend?" : <Loading />}
    </Button>
  );
};
