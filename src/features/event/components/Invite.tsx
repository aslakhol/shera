import { Events } from "@prisma/client";
import { User } from "next-auth";

type InviteProps = {
  event: Events & {
    host: User;
  };
};

const Invite = (props: InviteProps) => {
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
    <>
      {!!navigator.share && (
        <button className="btn btn-outline" onClick={share}>
          Invite friends
        </button>
      )}
    </>
  );
};

export default Invite;
