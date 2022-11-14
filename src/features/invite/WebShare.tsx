import { Events } from "@prisma/client";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

type WebShareProps = {
  event: Events & {
    host: User;
  };
};

const WebShare = (props: WebShareProps) => {
  const { event } = props;

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
    <button className="btn btn-outline" onClick={share}>
      Invite
    </button>
  );
};

export default WebShare;
