import { type Event, type User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LinkInvite } from "./LinkInvite";
import { EmailInvite } from "./EmailInvite";
import { Separator } from "../ui/separator";

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
          <Separator />
          <EmailInvite event={event} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Invite;
