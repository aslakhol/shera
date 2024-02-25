import { type Event, type User } from "@prisma/client";
import NoWebShare from "./NoWebShare";
import WebShare from "./WebShare";

type InviteProps = {
  event: Event & {
    host: User;
  };
};

const Invite = (props: InviteProps) => {
  const { event } = props;

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

export default Invite;
