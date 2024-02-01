import { type Events } from "@prisma/client";
import { type User } from "next-auth";
import { Button } from "../ui/button";
import { toast } from "sonner";

type NoWebShareProps = {
  event: Events & {
    host: User;
  };
};

const NoWebShare = (props: NoWebShareProps) => {
  const { event } = props;

  let timeout: NodeJS.Timeout;

  const share = async () => {
    clearTimeout(timeout);
    await navigator.clipboard.writeText(
      `https://shera.no/events/${event.eventId}`,
    );
    toast("Link copied, now share it with your friends!");
  };

  return (
    <Button variant="outline" onClick={share}>
      Invite
    </Button>
  );
};

export default NoWebShare;
