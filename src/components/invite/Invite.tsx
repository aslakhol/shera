import { type Event, type User } from "@prisma/client";
import NoWebShare from "./NoWebShare";
import WebShare from "./WebShare";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

type InviteProps = {
  event: Event & {
    host: User;
  };
};

const Invite = (props: InviteProps) => {
  const { event } = props;

  return (
    <>
      <Dialog>
        <Button asChild variant="outline">
          <DialogTrigger>Invite</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Invite</DialogTitle>
          </DialogHeader>

          <LinkInvite event={event} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Invite;

type LinkInviteProps = {
  event: Event & {
    host: User;
  };
};

const LinkInvite = ({ event }: LinkInviteProps) => {
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
