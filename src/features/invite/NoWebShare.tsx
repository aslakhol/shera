import { Events } from "@prisma/client";
import { User } from "next-auth";
import { useState } from "react";
import Toast from "./Toast";

type NoWebShareProps = {
  event: Events & {
    host: User;
  };
};

const NoWebShare = (props: NoWebShareProps) => {
  const { event } = props;
  const [displayToast, setDisplayToast] = useState(false);

  let timeout: NodeJS.Timeout;

  const share = () => {
    clearTimeout(timeout);
    navigator.clipboard.writeText(`https://shera.no/events/${event.eventId}`);

    setDisplayToast(true);

    timeout = setTimeout(() => {
      setDisplayToast(false);

      return () => clearTimeout(timeout);
    }, 4000);
  };

  return (
    <>
      <button className="btn btn-outline" onClick={share}>
        Invite
      </button>
      <Toast display={displayToast} />
    </>
  );
};

export default NoWebShare;
