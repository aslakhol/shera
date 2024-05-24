import { type User, type Event } from "@prisma/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { fullEventId } from "../../utils/event";

type LinkInviteProps = {
  event: Event & {
    host: User;
  };
};

export const LinkInvite = ({ event }: LinkInviteProps) => {
  return (
    <>
      {!!navigator.share ? (
        <WebShare event={event} />
      ) : (
        <NoWebShare event={event} />
      )}
    </>
  );
};

type NoWebShareProps = {
  event: Event & {
    host: User;
  };
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

type WebShareProps = {
  event: Event & {
    host: User;
  };
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
    <Button variant="outline" onClick={share}>
      Copy invite link
    </Button>
  );
};
