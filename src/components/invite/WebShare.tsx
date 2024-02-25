import { type Event } from "@prisma/client";
import { type User } from "next-auth";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

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
        url: `https://shera.no/events/${event.eventId}`,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  };

  return (
    <Button variant="outline" onClick={share}>
      Invite
    </Button>
  );
};

export default WebShare;
