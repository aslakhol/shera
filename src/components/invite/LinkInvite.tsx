import { Button } from "../ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { fullEventId } from "../../utils/event";
import { type EventWithHosts } from "../../utils/types";

type LinkInviteProps = {
  event: EventWithHosts;
};

export const LinkInvite = ({ event }: LinkInviteProps) => {
  return (
    <div className="flex h-full flex-col justify-between">
      <p>
        Anyone with the link can attend the event. Copy the link below and send
        it to your friends.
      </p>
      <div className="flex gap-2">
        <CopyLink event={event} />
        {!!navigator.share && <WebShare event={event} />}
      </div>
    </div>
  );
};

type NoWebShareProps = {
  event: EventWithHosts;
};

const CopyLink = (props: NoWebShareProps) => {
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
    <Button variant="outline" className="w-full" onClick={share}>
      Copy invite link
    </Button>
  );
};

type WebShareProps = {
  event: EventWithHosts;
};

const WebShare = ({ event }: WebShareProps) => {
  const { data } = useSession();

  const text = data?.user.name
    ? `${data.user.name} has invited you to ${event.title}!`
    : `You have been invited to ${event.title}!`;

  const share = () => {
    navigator
      .share({
        title: "You've been invited to an event!",
        text: text,
        url: `https://shera.no/events/${fullEventId(event)}`,
      })
      .catch((error) => console.log("Error sharing", error));
  };

  return (
    <Button variant="outline" className="w-full" onClick={share}>
      Share event
    </Button>
  );
};
