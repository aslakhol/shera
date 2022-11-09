import { Events } from "@prisma/client";
import { User } from "next-auth";

type WebShareProps = {
  event: Events & {
    host: User;
  };
};

const WebShare = (props: WebShareProps) => {
  const { event } = props;

  const share = () => {
    navigator
      .share({
        title: "You've been invited to an event!",
        text: `${event.host.name} has invited you to ${event.title}!`,
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
