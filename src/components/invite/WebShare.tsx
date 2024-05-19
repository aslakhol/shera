import { type Event } from "@prisma/client";
import { type User } from "next-auth";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { fullEventId } from "../../utils/event";

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
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  };

  return (
    <Button variant="outline" onClick={share}>
      Copy invite link
    </Button>
  );
};

export default WebShare;
