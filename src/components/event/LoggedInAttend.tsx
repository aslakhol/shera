import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { Button } from "../ui/button";
import { Loading } from "../Loading";

type Props = { publicId: string };

export const LoggedInAttend = ({ publicId }: Props) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const { data: attendees } = api.events.attendees.useQuery({ publicId });
  const loggedInAttendMutation = api.events.loggedInAttend.useMutation();

  const attend = () => {
    if (!session?.user || !session.user.email) {
      return;
    }

    loggedInAttendMutation.mutate(
      {
        email: session.user.email,
        name: session.user.name ?? session.user.email,
        userId: session.user.id,
        publicId,
        status: "GOING",
      },
      {
        onSuccess: () => {
          void utils.events.attendees.invalidate({ publicId });
        },
      },
    );
  };

  const isAlreadyAttending = attendees?.some(
    (a) => a.email === session?.user?.email || a.userId === session?.user?.id,
  );

  if (isAlreadyAttending) {
    return <></>;
  }

  return (
    <Button variant="outline" onClick={attend}>
      {loggedInAttendMutation.isIdle ? "Attend?" : <Loading />}
    </Button>
  );
};
