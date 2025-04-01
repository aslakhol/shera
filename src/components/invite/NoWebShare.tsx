import { Button } from "../ui/button";
import { toast } from "sonner";
import { fullEventId } from "../../utils/event";
import { type EventWithHosts } from "../../utils/types";

type NoWebShareProps = {
  event: EventWithHosts;
};

const NoWebShare = (props: NoWebShareProps) => {
  const { event } = props;

  let timeout: NodeJS.Timeout;

  const share = async () => {
    clearTimeout(timeout);
    await navigator.clipboard.writeText(
      `https://shera.no/events/${fullEventId(event)}`,
    );
    toast("Link copied, now share it with your friends!");
  };

  return (
    <Button variant="outline" onClick={share}>
      Copy invite link
    </Button>
  );
};

export default NoWebShare;
